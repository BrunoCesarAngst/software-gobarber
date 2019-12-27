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
}

export default new NotificationController();
