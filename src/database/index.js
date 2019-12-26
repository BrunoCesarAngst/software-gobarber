import Sequelize from 'sequelize';

// importando a model e cria um array das models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

// array das models
const models = [User, File, Appointment];

class Database {
  constructor() {
    /** chamamos o método init para separar essa classe em mais métodos, pois
     * teremos outras conexões  */
    this.init();
  }

  /**
   * esse método init é responsável pela conexão com a base de dados e carregar as models.
   */
  init() {
    /**
     * aqui eu tenho a minha conexão com o banco de dados, pois, importei a
     * configuração.
     * a variável this.connection está sendo esperada na parte
     * static init(sequelize) do arquivo '../config/database.js.
     */
    this.connection = new Sequelize(databaseConfig);

    /**
     * percorrendo a array de models, passando para cada model a conexão com a
     * base de dados.
     * então chamamos esse arquivo de database no arquivo '../app.js'
     */
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
