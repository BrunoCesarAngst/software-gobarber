import User from '../models/User';

// essa é face do controller
class UserController {
  // é um cadastro de novos usuários
  async store(req, res) {
    /**
     * essa variável recebe um registro de busca, se o email passado é igual a
     * um já existente na base de dados
     */
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }
}

export default new UserController();
// exportamos para o arquivo ./routes.js
