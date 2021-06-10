'use strict';
module.exports = (sequelize, DataTypes) => {
  const Lga = sequelize.define('Lga', {
    lga: DataTypes.STRING,
    state_id: DataTypes.BIGINT
  }, {});
  Lga.associate = function(models) {
    // associations can be defined here
    Lga.belongsTo(models.State, {
      foreignKey: 'state_id',
      onDelete: 'CASCADE',
    });
  };
  return Lga;
};