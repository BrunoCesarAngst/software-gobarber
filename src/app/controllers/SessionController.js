import jwt from 'jsonwebtoken';

import * as Yup from 'yup';

import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    /**
     * fazendo as validações
     * o req.body é um objeto(Yup.object()), que tem esse formato(shape)
     */
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required()
    });

    // verificamos se o req.body está conforme o schema validation do yup
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found!' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not math' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      /**
       * jwt.sign tem 3 parâmetros:
       * - no primeiro parâmetro é o payload são informações que se queira
       * incorporar no token, nesse caso o id do usuário.
       * - o segundo é uma string, um texto que é único dessa aplicação;
       * que obtenho desse endereço https://www.md5online.org/.
       * gero um arquivo auth.js na parta config que configura esses dados
       * assim como o terceiro parâmetro que é a validade do token.
       */
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
      // definimos a rota que irá acessar esse método do SessionController em routes.js
    });
  }
}

export default new SessionController();
