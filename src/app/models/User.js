import Sequelize, { Model } from 'sequelize';

// para fazer criptografia das senhas dos usuários
import bcrypt from 'bcryptjs';

class User extends Model {
  // um método que é chamado automaticamente pelo sequelize
  static init(sequelize) {
    /**
     * chamando o método init com super o Model a classe pai que estendemos,
     * enviando as colunas que estão na nossa base de dados, que são inseridas
     * por usuários, gerando novos usuários.
     */
    super.init(
      /**
       * dos dois parâmetros do super.init:
       * - o primeiro é esse objeto contendo todos os valores que o usuário pode receber na hora de criação, edição de um novo usuário.
       */
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN
      },
      /**
       * - o segundo um objeto recebendo como configuração o sequelize.
       */
      {
        sequelize
      }
    );

    /**
     * hooks são trechos de código que são executados de forma automáticas
     * baseados em ações que aconteçem no model, nesse caso antes de ser salvo
     * o usuário, será rodado o hook
     */
    this.addHook('beforeSave', async user => {
      /**
       * quando estiver cadastrando um novo usuário, ou, editando, quando for
       * registrado um password é para ser gerado um password_hash.
       */
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  /**
   * criamos o método para fazer a relacionamento entre o model User e File.
   * associate recebe todos os models
   */
  static associate(models) {
    /**
     * this.belongsTo, este pertence para o model de File, teremos um id de
     * arquivo sendo armazenado no model de usuário informando qual é a coluna
     * de Users que vai armazenar a referencia da tabela Files.
     */
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }

  // validando a senha do usuário
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
