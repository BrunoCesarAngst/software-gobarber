import 'dotenv/config';

import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import 'express-async-errors';
import routes from './routes';
// importando routes.js

// recebendo a configuração da conexão.
import './database';

/**
 * fazendo uso de classes no back-end é legal, pois, é dado nome as funcionalidades
 */
class App {
  // o método constructor é chamado automaticamente, quando instanciamos a class App
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    // chamando os métodos
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    // para poder receber requisições no formato json
    /**
     * usando o recurso de express.static, que podem ser acessados pelo
     * navegador
     */
    this.server.use(
      // /files é a rota que serve os arquivos estáticos
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // recebendo as rotas importando-as de outro arquivo o routes.js
    // as routes também são middlewares é possível passar elas pelo 'use'
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
// estou instanciando minha aplicação "App" com o server que pode ser acessada da minha classe
