import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class CancellationMail {
  /**
   * tornar o valor/status dessa propriedade/variável sem requerer o uso de
   * chamadas de método explícitas
   */
  get key() {
    // para cada job uma chave única
    return 'CancellationMail';
  }

  /**
   * atarefa que vai chamada quando esse processo for executado, em uma fila
   * vai ser necessário enviar dez emails, o handle vai ser chamado para o
   * envio de cada email.
   * para receber as informações de appointment, elas serão passadas como
   * parâmetro "data" dentro do handle
   */
  async handle({ data }) {
    // dentro de data vem todas as informações necessárias
    const { appointment } = data;
    // após o cancelamento do serviço enviamos o email.
    await Mail.sendMail({
      // usando os dados de provider
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado!',
      // passando o template que será usado.
      template: 'cancellation',
      // context está enviando todas as variáveis necessárias para o template
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'Dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt
          }
        )
      }
    });
  }
}

export default new CancellationMail();
