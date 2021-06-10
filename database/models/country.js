'use strict';
module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    sortname: DataTypes.STRING,
    country: DataTypes.STRING
  }, {});
  Country.associate = function(models) {
    // associations can be defined here
    Country.hasMany(models.State, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE'
    });
  };
  return Country;
};