'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DeliveryJobs', {
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
      user_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      pickup_user: {
        type: Sequelize.BIGINT,
        allowNull:true
      },
      delivery_tag: {
        type: Sequelize.TEXT
      },
      delivery_price_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'DeliveryPrices',
          key: 'id'
        }
      },
      delivery_level_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'DeliveryLevels',
          key: 'id'
        }
      },
      pickup_time: {
        type: Sequelize.STRING
      },
      pickup_date: {
        type: Sequelize.STRING
      },
      driver_id: {
        type: Sequelize.BIGINT,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      pickup_lat: {
        type: Sequelize.STRING
      },
      pickup_lng: {
        type: Sequelize.STRING
      },
      pickup_address: {
        type: Sequelize.TEXT
      },
      total_fare: {
        type: Sequelize.STRING
      },
      insurance_amount: {
        type: Sequelize.STRING,
        allowNull:true
      },
      discount_amount: {
        type: Sequelize.STRING,
        allowNull:true
      },
      good_worth: {
        type: Sequelize.STRING,
        allowNull:true
      },
      delivery_type: {
        type: Sequelize.ENUM('priority', 'scheduled'),
        defaultValue:'priority'
      },
      is_insured: {
        type: Sequelize.ENUM('yes', 'no'),
        defaultValue:'no'
      },
      user_hands_parcel: {
        type: Sequelize.ENUM('0','1'),
        defaultValue:'0'
      },
      driver_pickup_parcel: {
        type: Sequelize.ENUM('0','1'),
        defaultValue:'0'
      },
      promo_code: {
        type: Sequelize.TEXT,
        allowNull:true
      },
      payment_status: {
        type: Sequelize.ENUM('paid', 'pending'),
        defaultValue:'pending'
      },
      payment_method: {
        type: Sequelize.ENUM('wallet', 'cash'),
        defaultValue:'wallet'
      },
      status: {
        type: Sequelize.ENUM('0','1','2','3','4','5','6','7','8','9'),
        defaultValue:'0'//'0 = ride created but not accepted by any driver,  1 = ride accepted but driver not started ride, 2 = ride request time out  3 = driver reached for pick item 4 = ride started for delivery item, 5 = driver reached at destination place 6 = ride completed,  7 = ride cancelled by driver after accept ride,  8 = ride cancelled by user., 9 = user cancel search'
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
    return queryInterface.dropTable('DeliveryJobs');
  }
};