import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    // se não há data
    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // garantindo que o numero seja um inteiro
    const searchDate = Number(date);

    // buscando todos agendamentos
    const appointments = await Appointment.findAll({
      where: {
        // do prestador que vem pela rota
        provider_id: req.params.providerId,
        // dos agendamentos não cancelados
        canceled_at: null,
        // filtrando por data
        date: {
          /**
           * [Op.between]: uma variável entre colchetes seta como nome da
           * propriedade dentro do objeto retornado como chave do objeto o valor
           *  que ele recebe é um array passando os dois valores de comparação
           * [startOfDay(searchDate), endOfDay(searchDate)]
           */
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      }
    });

    // os horários de um dia
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      // '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00'
    ];

    /**
     * percorrendo schedule
     */
    const available = schedule.map(time => {
      // pegando separadamente hora e minuto
      const [hour, minute] = time.split(':');
      // configurando nesse formato 2019-12-29 08:00:00
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      // retornando um vetor com os objetos para available
      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          // a data e depois de agora
          isAfter(value, new Date()) &&
          /**
           * procurando um não agendamento em cada appointment onde a hora do
           * agendamento é igual a hora de schedule
           */
          !appointments.find(a => format(a.date, 'HH:mm') === time)
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
