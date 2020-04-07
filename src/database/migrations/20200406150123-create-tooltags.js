module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tooltags', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      toolid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tools', key: 'id' },
        onDelete: 'CASCADE',
      },
      tagid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tags', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('tooltags');
  },
};
