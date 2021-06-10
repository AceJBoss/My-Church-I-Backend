'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull:true
      },
      image_key: {
        type: Sequelize.TEXT,
        allowNull:true
      },
      device_token: {
        type: Sequelize.TEXT,
        allowNull:true
      },
      first_name: {
        type: Sequelize.TEXT
      },
      last_name: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      ref_code: {
        type: Sequelize.STRING,
        allowNull:true
      },
      password: {
        type: Sequelize.STRING
      },
      user_type_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'UserTypes',
          key: 'id'
        }
      },
      user_otp: {
        type: Sequelize.STRING,
        allowNull:true
      },
      status: {
        type: Sequelize.ENUM('Active', 'Pending', 'Suspended'),
        defaultValue: 'Pending'
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
    return queryInterface.dropTable('Users');
  }
};