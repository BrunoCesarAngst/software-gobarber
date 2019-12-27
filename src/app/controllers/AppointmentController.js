import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class AppointmentController {
  // Listando agendamentos do usuário
  async index(req, res) {
    // Aplicando paginação
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      // Aplicando paginação
      limit: 20,
      offset: (page - 1) * 20,
      // incluir os dados do prestador de serviços.
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          // incluindo o avatar do provider.
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url']
            }
          ]
        }
      ]
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { provider_id, date } = req.body;

    /**
     * checando se provider_id não é o usuário logado e se é um prestador
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    const userLogged = await User.findByPk(req.userId);

    if (provider_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'You cannot schedule a service for yourself.' });
    }

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointment with providers!' });
    }

    /**
     * verifique a data passada
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * verifique a disponibilidade da data
     */
    const checkAvailability = await Appointment.findOne({
      where: { provider_id, canceled_at: null, date: hourStart }
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    // criando o agendamento
    const appointment = await Appointment.create({
      // configuração que vem do auth.js da pasta middlewares
      user_id: req.userId,
      provider_id,
      date: hourStart
    });

    /**
     * notificando novo agendamento para o prestador
     */
    // usuário logado
    const user = await User.findByPk(req.userId);
    // formatando a data para a notificação, aspas simples não formata.
    const formattedDate = format(hourStart, "'dia' dd 'de' MMM', às' H:mm'h'", {
      // traduzindo o mês
      locale: pt
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    // pegando o id bo banco de dados
    const appointment = await Appointment.findByPk(req.params.id);

    // verificando se usuário logado é o dono do agendamento.
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't permission to cancel this appointment!"
      });
    }

    // subtraindo duas horas do horário agendado.
    const dateWithSub = subHours(appointment.date, 2);

    /**
     * se o dateWithSub for antes da hora atual, não se pode cancelar o
     * agendamento
     */
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointment 2 hours in advance.'
      });
    }

    // "setando" o canceled_at
    appointment.canceled_at = new Date();

    await appointment.save();

    return res.json(appointment);
  }
}

export default new AppointmentController();
