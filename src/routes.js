import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// importando a middleware de autenticação
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// definimos a middleware como global valendo para as rotas posteriores
routes.use(authMiddleware);

// rota para alteração de cadastro de usuário.
routes.put('/users', UserController.update);

export default routes;
