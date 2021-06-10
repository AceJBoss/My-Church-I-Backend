'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeliveryMode = sequelize.define('DeliveryMode', {
    vehicle: DataTypes.STRING,
    description: DataTypes.TEXT,
    max_distance: DataTypes.STRING,
    status: {
		type: DataTypes.ENUM('0','1'),
		defaultValue:'1'
	}
  }, {});
  DeliveryMode.associate = function(models) {
    // associations can be defined here
    DeliveryMode.hasMany(models.DeliveryPrice, {
      foreignKey: 'delivery_mode_id',
      onDelete: 'CASCADE',
    });

    DeliveryMode.hasMany(models.DriverLicense, {
      foreignKey: 'delivery_mode_id',
      onDelete: 'CASCADE',
    });
  };
  return DeliveryMode;
};