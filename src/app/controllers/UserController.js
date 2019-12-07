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

  // esse método é para usuários fazerem alteração de cadastro, portanto, será acessível somente para usuários que estejam logados
  async update(req, res) {
    // buscamos o email o oldPassword do corpo da requisição
    const { email, oldPassword } = req.body;

    // buscamos do banco de dados o usuário que quer ser alterado
    const user = await User.findByPk(req.userId);

    // verificando inicialmente se o usuário estiver mudando de email
    if (email !== user.email) {
      /**
       * essa variável recebe um registro de busca, se o email passado é igual a
       * um já existente na base de dados
       */
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    /**
     * se o usuário quiser alterar a senha, ele estará informando a senha
     * antiga e então verificando se o a senha antiga é a senha que ele já tem.
     */
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // se tudo deu certo, atualizamos o usuário com as informações do req.body
    const { id, name, provider } = await user.update(req.body);

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
