'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PromoCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      promo_type: {
        type: Sequelize.ENUM('sponsored', 'system'),
        defaultValue:'system'
      },
      criteria: {
        type: Sequelize.ENUM('all', 'freshers', 'atmost 10', 'atmost 20', '30 above'),
        defaultValue:'all'
      },
      promo_code: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.ENUM('24 hours', '1 weeks', '2 weeks', '3 weeks', '4 weeks'),
        defaultValue:'24 hours'
      },
      discount: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('PromoCodes');
  }
};