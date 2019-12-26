module.exports = {
  up: (queryInterface, Sequelize) => {
    // adicionamos na tabela users a coluna avatar_id.
    return queryInterface.addColumn('users', 'avatar_id', {
      // referenciamos somente o id do arquivo
      type: Sequelize.INTEGER,
      /**
       * criamos uma chave estrangeira 'foreign key'.
       * através do objeto de references indicamos qual é o nome da tabela e
       * qual a chave que será referenciado, que estará dizendo que todo
       * avatar_id da tabela users, vai ser também um id contido na tabela files
       */
      references: { model: 'files', key: 'id' },
      // quando alterado em files altera em users
      onUpdate: 'CASCADE',
      // quando deletado em files altera como nulo em users
      onDelete: 'SET NULL',
      allowNull: true
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'avatar_id');
  }
};
