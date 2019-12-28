import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
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

    // chamando o método de configuração do templete dos email de cancelamento.
    this.configureTemplates();
  }

  configureTemplates() {
    // chegando até a pasta emails.
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    /**
     * compile é como será compilado nossos templates de email a formação da
     * nossas mensagens
     */
    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          // qual é o arquivo padrão.
          defaultLayout: 'default',
          // qual a extensão que usamos para handlebars
          extname: '.hbs'
        }),
        viewPath,
        extName: '.hbs'
      })
    );
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
