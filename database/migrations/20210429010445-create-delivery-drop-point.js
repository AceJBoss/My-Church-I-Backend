'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DeliveryDropPoints', {
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
      delivery_job_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'DeliveryJobs',
          key: 'id'
        }
      },
      droppoint_lat: {
        type: Sequelize.STRING
      },
      droppoint_lng: {
        type: Sequelize.STRING
      },
      droppoint_address: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      item_name: {
        type: Sequelize.TEXT
      },
      item_type: {
        type: Sequelize.STRING
      },
      is_delivered: {
        type: Sequelize.ENUM('0','1'),
        defaultValue:'0'
      },
      status: {
        type: Sequelize.ENUM('pending', 'delivered'),
        defaultValue:'pending'
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
    return queryInterface.dropTable('DeliveryDropPoints');
  }
};