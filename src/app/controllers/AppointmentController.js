import * as Yup from 'yup';
import User from '../models/User';
import Appointment from '../models/Appointment';

class AppointmentController {
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
     * checando se provider_id é um provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'you can only create appointment with providers!' });
    }

    // criando o agendamento
    const appointment = await Appointment.create({
      // configuração que vem do auth.js da pasta middlewares
      user_id: req.userId,
      provider_id,
      date
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
