'use strict';
module.exports = (sequelize, DataTypes) => {
  const State = sequelize.define('State', {
    state: DataTypes.STRING,
    country_id: DataTypes.BIGINT
  }, {});
  State.associate = function(models) {
    // associations can be defined here
    State.belongsTo(models.Country, {
      foreignKey: 'country_id',
      onDelete: 'CASCADE',
    });

    State.hasMany(models.Lga, {
      foreignKey: 'state_id',
      onDelete: 'CASCADE',
    });
  };
  return State;
};