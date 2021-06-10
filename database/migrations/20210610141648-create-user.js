'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      marital_status: {
        type: Sequelize.ENUM('Single', 'Married', 'Divorced')
      },
      dob: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      image_url: {
        type: Sequelize.TEXT
      },
      image_key: {
        type: Sequelize.TEXT
      },
      password: {
        type: Sequelize.STRING
      },
      lga_id: {
        type: Sequelize.INTEGER
      },
      user_type_id: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Active', 'Suspended')
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};