import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    /**
     * checando se usuário logado é um prestador de serviço
     */
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications!' });
    }

    // criando a notificação
    const notifications = await Notification.find({
      // notificando o usuário logado
      user: req.userId
    })
      // formatando com changing do mongoose.
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    /**
     * buscando a notificação no banco de dados.
     * mas ao invés de buscar diretamente com:
     * const notification = await Notification.findById(req.params.id);
     * usaremos um método do mongoose
     */
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      // o que queremos atualizar
      {
        read: true
      },
      // depois de atualizada a um retorno a nova notificação.
      {
        new: true
      }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
