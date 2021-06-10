'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Drivers', {
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
      organization_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'Organizations',
          key: 'id'
        }
      },
      lat: {
        type: Sequelize.DOUBLE
      },
      lng: {
        type: Sequelize.DOUBLE
      },
      wake_point_lat: {
        type: Sequelize.DOUBLE,
        allowNull:true
      },
      wake_point_lng: {
        type: Sequelize.DOUBLE,
        allowNull:true
      },
      duty_on: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0'
      },
      dob: {
        type: Sequelize.STRING,
        allowNull:true
      },
      license_uploaded: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0'
      },
      is_verified_by_admin: {
        type: Sequelize.ENUM('0', '1'),
        defaultValue: '0'
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
    return queryInterface.dropTable('Drivers');
  }
};