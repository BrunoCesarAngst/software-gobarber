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
import AvailableController from './app/controllers/AvailableController';

// importando a middleware de autenticação
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// criar usuário
routes.post('/users', UserController.store);
// listar usuários
routes.get('/users', UserController.index);
// criar sessão
routes.post('/sessions', SessionController.store);

// definimos a middleware como global valendo para as rotas posteriores
routes.use(authMiddleware);

// rota para alteração de cadastro de usuário.
routes.put('/users', UserController.update);

// Listagem de prestadores de serviço
routes.get('/providers', ProviderController.index);
// Listagem dos horários disponíveis de um prestador
routes.get('/providers/:providerId/available', AvailableController.index);

// Listando agendamentos do usuário
routes.get('/appointments', AppointmentController.index);
// Agendamento de serviço
routes.post('/appointments', AppointmentController.store);
// Cancelamento de agendamento
routes.delete('/appointments/:id', AppointmentController.delete);

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
