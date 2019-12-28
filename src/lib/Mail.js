import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    // trazendo parâmetros
    const { host, port, secure, auth } = mailConfig;

    // chamando um serviço externo para envio de email.
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      // por existir algumas estratégias de envio de email que não tem usuário.
      auth: auth.user ? auth : null
    });
  }

  /**
   * essa é parte que envia o email, que recebe a mensagem de
   * AppointController.js
   */
  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message
    });
  }
}

export default new Mail();
