'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeliveryPrice = sequelize.define('DeliveryPrice', {
    delivery_type: {
      type: DataTypes.ENUM('priority', 'scheduled'),
      defaultValue:'priority'
    },
    delivery_mode_id: DataTypes.BIGINT,
    km_price: DataTypes.STRING
  }, {});
  DeliveryPrice.associate = function(models) {
    // associations can be defined here
    DeliveryPrice.belongsTo(models.DeliveryMode, {
      foreignKey: 'delivery_mode_id',
      onDelete: 'CASCADE',
    });

    DeliveryPrice.hasMany(models.DeliveryJob, {
      foreignKey: 'delivery_price_id',
      onDelete: 'CASCADE',
    });

  };
  return DeliveryPrice;
};