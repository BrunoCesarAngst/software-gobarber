module.exports = {
  // quando a migration for executada
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      // marcando o usuário do agendamento
      user_id: {
        // referenciamos somente o id do arquivo
        type: Sequelize.INTEGER,
        /**
         * criamos uma chave estrangeira 'foreign key'.
         * através do objeto de references indicamos qual é o nome da tabela e
         * qual a chave que será referenciado, que estará dizendo que todo
         * user_id da tabela appointments, vai ser também um id contido na tabela users
         */
        references: { model: 'users', key: 'id' },
        // quando alterado em users altera em appointments
        onUpdate: 'CASCADE',
        /**
         * quando deletado em users altera como nulo em users, mas, mantem
         * registro
         */
        onDelete: 'SET NULL',
        allowNull: true
      },
      // marcando o prestador desse agendamento
      provider_id: {
        // referenciamos somente o id do arquivo
        type: Sequelize.INTEGER,
        /**
         * criamos uma chave estrangeira 'foreign key'.
         * através do objeto de references indicamos qual é o nome da tabela e
         * qual a chave que será referenciado, que estará dizendo que todo
         * user_id da tabela appointments, vai ser também um id contido na tabela users
         */
        references: { model: 'users', key: 'id' },
        // quando alterado em users altera em appointments
        onUpdate: 'CASCADE',
        /**
         * quando deletado em users altera como nulo em users, mas, mantem
         * registro
         */
        onDelete: 'SET NULL',
        allowNull: true
      },
      // controlando os cancelamentos.
      canceled_at: {
        type: Sequelize.DATE
      },
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
    return queryInterface.dropTable('appointments');
  }
};
