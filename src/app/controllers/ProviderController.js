import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    // aqui retorna todo tipo de usuário.
    const providers = await User.findAll({
      // passamos uma condição para filtrar.
      where: { provider: true },
      // aqui filtro as informações de req.file
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // aqui incluímos todos os dados de avatar do model File.
      include: [
        {
          model: File,
          // lembrando o alias do relacionamento em User.js
          as: 'avatar',
          // mais uma vez filtramos as informações.
          attributes: ['name', 'path', 'url']
        }
      ]
    });

    return res.json(providers);
  }
}

export default new ProviderController();
