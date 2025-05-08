'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add userId as nullable
    await queryInterface.addColumn('Employees', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true, // initially nullable to avoid error
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    
    await queryInterface.sequelize.query(`
      UPDATE "Employees" SET "userId" = 1
    `);

    // Step 3: Make userId NOT NULL after backfill
    await queryInterface.changeColumn('Employees', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Employees', 'userId');
  }
};
