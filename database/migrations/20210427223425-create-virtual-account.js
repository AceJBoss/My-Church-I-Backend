'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('VirtualAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      account_name: {
        type: Sequelize.TEXT
      },
      bank_name: {
        type: Sequelize.TEXT
      },
      account_no: {
        type: Sequelize.STRING
      },
      order_ref: {
        type: Sequelize.STRING
      },
      narration: {
        type: Sequelize.TEXT
      },
      bvn: {
        type: Sequelize.STRING,
        allowNull:true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('VirtualAccounts');
  }
};