import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

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

// Listagem de prestadores de serviço
routes.get('/providers', ProviderController.index);

// Listando agendamentos do usuário
routes.get('/appointments', AppointmentController.index);
// Agendamento de serviço
routes.post('/appointments', AppointmentController.store);

// Listando agenda do prestador
routes.get('/schedule', ScheduleController.index);

// Listando notificações do usuário
routes.get('/notifications', NotificationController.index);
// Marcar notificações como lidas
routes.put('/notifications/:id', NotificationController.update);

/**
 * upload.single('file') é uma middleware recebendo do campo de requisição
 * 'file', somente um arquivo.
 */
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
