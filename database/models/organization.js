'use strict';
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    user_id: DataTypes.BIGINT,
    address: DataTypes.TEXT,
    ride_charge: {
      type: DataTypes.DECIMAL(15,2),
      defaultValue:0.00
    },
    status: {
    	type: DataTypes.ENUM('pending', 'verified'),
    	defaultValue : 'pending'
    }
  }, {});
  Organization.associate = function(models) {
    // associations can be defined here
    Organization.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    Organization.hasMany(models.Driver, {
      foreignKey: 'organization_id',
      onDelete: 'CASCADE',
    });
  };
  return Organization;
};