'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeliveryLevel = sequelize.define('DeliveryLevel', {
    level: DataTypes.STRING,
    code: DataTypes.STRING,
    charge: DataTypes.DOUBLE
  }, {});
  DeliveryLevel.associate = function(models) {
    // associations can be defined here
    DeliveryLevel.hasMany(models.DeliveryJob, {
      foreignKey: 'delivery_level_id',
      onDelete: 'CASCADE',
    });
  };
  return DeliveryLevel;
};