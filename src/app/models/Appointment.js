import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
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
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE
      },
      /**
       * - o segundo um objeto recebendo como configuração o sequelize.
       */
      {
        sequelize
      }
    );

    return this;
  }

  /**
   * criamos o método para fazer a relacionamento entre o model Appointment e
   * User.
   * associate recebe todos os models
   */
  static associate(models) {
    /**
     * this.belongsTo, este pertence para o model de User, teremos um id de
     * usuário sendo armazenado no model de usuário; informando qual é a coluna
     * de Users que vai armazenar a referencia da tabela Appointment.
     */
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    // passamos um alias para esse relacionamento
    /**
     * temos um segundo relacionamento
     * this.belongsTo, este pertence para o model de User, teremos um id de
     * provider sendo armazenado no model de usuário; informando qual é a coluna
     * de Users que vai armazenar a referencia da tabela Appointment.
     */
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    // passamos um alias para esse relacionamento
  }
}

export default Appointment;
