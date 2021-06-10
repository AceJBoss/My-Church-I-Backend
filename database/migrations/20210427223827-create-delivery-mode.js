'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DeliveryModes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      vehicle: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      max_distance: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('0','1'),
        defaultValue:'1'
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
    return queryInterface.dropTable('DeliveryModes');
  }
};