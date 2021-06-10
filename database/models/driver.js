'use strict';
module.exports = (sequelize, DataTypes) => {
  const Driver = sequelize.define('Driver', {
    user_id: DataTypes.BIGINT,
    organization_id: DataTypes.BIGINT,
    lat: DataTypes.DOUBLE,
    lng: DataTypes.DOUBLE,
    wake_point_lat: DataTypes.DOUBLE,
    wake_point_lng: DataTypes.DOUBLE,
    duty_on: {
      type: DataTypes.ENUM('0','1'),
      defaultValue: '0'
    },
    dob: DataTypes.STRING,
    license_uploaded: {
      type: DataTypes.ENUM('0','1'),
      defaultValue: '0'
    },
    is_verified_by_admin: {
      type: DataTypes.ENUM('0','1'),
      defaultValue: '0'
    }
  }, {});
  Driver.associate = function(models) {
    // associations can be defined here
    Driver.hasMany(models.DeliveryJob, {
      foreignKey: 'driver_id',
      onDelete: 'CASCADE',
    });

    Driver.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    Driver.belongsTo(models.Organization, {
      foreignKey: 'organization_id',
      onDelete: 'CASCADE',
    });

    Driver.hasOne(models.DriverLicense, {
      foreignKey: 'driver_id',
      onDelete: 'CASCADE',
    });
  };
  return Driver;
};