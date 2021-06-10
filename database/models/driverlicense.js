'use strict';
module.exports = (sequelize, DataTypes) => {
  const DriverLicense = sequelize.define('DriverLicense', {
    driver_id: DataTypes.BIGINT,
    license_image: DataTypes.TEXT,
    license_key: DataTypes.TEXT,
    delivery_mode_id: DataTypes.BIGINT,
    vehicle_brand: DataTypes.STRING,
    vehicle_number: DataTypes.STRING,
    vehicle_year: DataTypes.STRING
  }, {});
  DriverLicense.associate = function(models) {
    // associations can be defined here
    DriverLicense.belongsTo(models.Driver, {
      foreignKey: 'driver_id',
      onDelete: 'CASCADE',
    });

    DriverLicense.belongsTo(models.DeliveryMode, {
      foreignKey: 'delivery_mode_id',
      onDelete: 'CASCADE',
    });
  };
  return DriverLicense;
};