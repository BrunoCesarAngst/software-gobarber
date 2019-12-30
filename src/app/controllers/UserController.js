import * as Yup from 'yup';
// o yup não tem export default, assim é importado tudo dentro da variável Yup.

import User from '../models/User';

// essa é face do controller
class UserController {
  // é um cadastro de novos usuários
  async store(req, res) {
    /**
     * fazendo as validações
     * o req.body é um objeto(Yup.object()), que tem esse formato(shape)
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    // verificamos se o req.body está conforme o schema validation do yup
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

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

  async index(req, res) {
    // aqui retorna todo tipo de usuário.
    const users = await User.findAll({
      // aqui filtro as informações de req.file
      attributes: ['id', 'name', 'provider', 'email', 'avatar_id']
    });

    return res.json(users);
  }

  // esse método é para usuários fazerem alteração de cadastro, portanto, será acessível somente para usuários que estejam logados
  async update(req, res) {
    /**
     * fazendo as validações
     * o req.body é um objeto(Yup.object()), que tem esse formato(shape)
     */
    const schema = Yup.object().shape({
      // na edição de usuário o nome não é obrigatório
      name: Yup.string(),
      // o email não é obrigatório
      email: Yup.string().email(),
      // a antiga senha não é obrigatória
      oldPassword: Yup.string().min(6),
      /**
       * mas, se o usuário informou a senha antiga, então deve se informar a
       * nova senha.
       */
      password: Yup.string()
        .required()
        .min(6)
        // então se faz uma validação condicional, field é o próprio password
        .when('oldPassword', (oldPassword, field) =>
          /**
           * como essa função não tem corpo {}, estamos fazendo um return direto
           * com essa validação ternária, se oldPassword for diferente de false,
           * null ou undefined, field.required, ou seja, nova senha é
           * obrigatório, se não, não
           */
          oldPassword ? field.required() : field
        ),

      /**
       * para garantir que o usuário esteja alterando a senha dele, ele
       * preencha um capom de confirmação da senha
       */
      confirmPassword: Yup.string().when('password', (password, field) =>
        /**
         * se o password for preenchido o campo confirmPassword passa a ser
         * obrigatório a um de referencia ao password
         */
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });

    // verificamos se o req.body está conforme o schema validation do yup
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

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
