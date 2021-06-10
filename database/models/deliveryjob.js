'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeliveryJob = sequelize.define('DeliveryJob', {
    image_url: DataTypes.TEXT,
    image_key: DataTypes.TEXT,
    user_id: DataTypes.BIGINT,
    pickup_user: DataTypes.BIGINT,
    delivery_tag: DataTypes.TEXT,
    delivery_price_id: DataTypes.BIGINT,
    delivery_level_id: DataTypes.BIGINT,
    pickup_time: DataTypes.STRING,
    pickup_date: DataTypes.STRING,
    driver_id: DataTypes.BIGINT,
    pickup_lat: DataTypes.STRING,
    pickup_lng: DataTypes.STRING,
    pickup_address: DataTypes.TEXT,
    total_fare: DataTypes.STRING,
    insurance_amount: DataTypes.STRING,
    discount_amount: DataTypes.STRING,
    good_worth: DataTypes.STRING,
    delivery_type: {
      type: DataTypes.ENUM('priority', 'scheduled'),
      defaultValue:'priority'
    },
    is_insured: {
        type: DataTypes.ENUM('yes', 'no'),
        defaultValue:'no'
    },
    user_hands_parcel: {
        type: DataTypes.ENUM('0','1'),
        defaultValue:'0'
    },
    driver_pickup_parcel: {
        type: DataTypes.ENUM('0','1'),
        defaultValue:'0'
    },
    promo_code: DataTypes.TEXT,
    payment_status: {
        type:DataTypes.ENUM('paid', 'pending'),
        defaultValue:'pending'
    },
    payment_method: {
        type:DataTypes.ENUM('wallet', 'cash'),
        defaultValue:'wallet'
    },
    status: {
        type:DataTypes.ENUM('0','1','2','3','4','5','6','7','8','9'),
        defaultValue:'0'
    }
  }, {});
  DeliveryJob.associate = function(models) {
    // associations can be defined here
    DeliveryJob.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    DeliveryJob.belongsTo(models.DeliveryPrice, {
      foreignKey: 'delivery_price_id',
      onDelete: 'CASCADE',
    });

    DeliveryJob.belongsTo(models.DeliveryLevel, {
      foreignKey: 'delivery_level_id',
      onDelete: 'CASCADE',
    });

    DeliveryJob.belongsTo(models.Driver, {
      foreignKey: 'driver_id',
      onDelete: 'CASCADE',
    });

    DeliveryJob.hasMany(models.DeliveryDropPoint, {
      foreignKey: 'delivery_job_id',
      onDelete: 'CASCADE',
    });
  };
  return DeliveryJob;
};