import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// importando a middleware de autenticação
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// definimos a middleware como global valendo para as rotas posteriores
routes.use(authMiddleware);

// rota para alteração de cadastro de usuário.
routes.put('/users', UserController.update);

/**
 * upload.single('file') é uma middleware recebendo do campo de requisição
 * 'file', somente um arquivo.
 */
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json(req.file);
});

export default routes;
