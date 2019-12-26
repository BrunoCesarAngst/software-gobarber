import Sequelize, { Model } from 'sequelize';

class File extends Model {
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
        path: Sequelize.STRING
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
}

export default File;
