import express from 'express';
import routes from './routes';
// importando routes.js

/**
 * fazendo uso de classes no back-end é legal, pois, é dado nome as funcionalidades
 */
class App {
  // o método contructor é chamado automaticamente, quando instanciamos a class App
  constructor() {
    this.server = express();

    // chamando os métodos
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    // para poder receber requisições no formato json
  }

  routes() {
    this.server.use(routes);
    // recebendo as rotas importando-as de outro arquivo o routes.js
    // as routes também são middlewares é possível passar elas pelo 'use'
  }
}

export default new App().server;
// estou instanciando minha aplicação "App" com o server que pode ser acessada da minha classe
