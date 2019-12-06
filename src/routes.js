import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Bruno César Angst',
    email: 'bruno.angst@rede.ulbra.br',
    password_hash: '12345671234567'
  });

  return res.json(user);
});

export default routes;
