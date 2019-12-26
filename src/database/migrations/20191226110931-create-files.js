module.exports = {
  // quando a migration for executada
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      // armazena a data de criação
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // armazena a data de alteração
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  // quando fizer o rollback
  down: queryInterface => {
    return queryInterface.dropTable('files');
  }
};
