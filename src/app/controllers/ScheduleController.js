// para tratar a data
import { startOfDay, endOfDay, parseISO } from 'date-fns';
// trabalhando com os operadores do sequelize.
import { Op } from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';

class ScheduleController {
  async index(req, res) {
    const checkUserIsProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!checkUserIsProvider) {
      return res.status(401).json({ error: 'User is not a provider!' });
    }

    // pegando o propriedade enviada pela query params.
    const { date } = req.query;
    // retorna a data analisada no fuso horário local
    const parsedDate = parseISO(date);

    // listando todos os agendamentos
    const appointments = await Appointment.findAll({
      where: {
        // prestador logado
        provider_id: req.userId,
        canceled_at: null,
        date: {
          /**
           * [Op.between]: uma variável entre colchetes seta como nome da
           * propriedade dentro do objeto retornado como chave do objeto o valor
           *  que ele recebe é um array passando os dois valores de comparação
           * [startOfDay(parsedDate), endOfDay(parsedDate)]
           */
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      order: ['date']
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
