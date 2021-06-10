'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DriverLicenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      driver_id: {
        type: Sequelize.BIGINT
      },
      license_image: {
        type: Sequelize.TEXT
      },
      license_key: {
        type: Sequelize.TEXT
      },
      delivery_mode_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'DeliveryModes',
          key: 'id'
        }
      },
      vehicle_brand: {
        type: Sequelize.STRING
      },
      vehicle_number: {
        type: Sequelize.STRING
      },
      vehicle_year: {
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
    return queryInterface.dropTable('DriverLicenses');
  }
};