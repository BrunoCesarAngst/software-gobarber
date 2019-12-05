module.exports = {
  // quando a migration for executada
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
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
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      // para criptografar a senha
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // o usuário pode ser o cliente como também o prestador de serviços
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      // armazena a data de criação
      create_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // armazena a data de alteração
      update_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  // quando fizer o rollback
  down: queryInterface => {
    return queryInterface.dropTable('users');
  }
};
