'use strict';
module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define('Referral', {
    user_id: DataTypes.BIGINT,
    referee_id: DataTypes.BIGINT,
    bonus: {
      type: DataTypes.DOUBLE,
      allowNull:true
    },
    status: {
      type: DataTypes.ENUM('unpaid', 'paid'),
      defaultValue: 'unpaid'
    }
  }, {});
  Referral.associate = function(models) {
    // associations can be defined here
    Referral.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    Referral.belongsTo(models.User, {
      foreignKey: 'referee_id',
      onDelete: 'CASCADE',
    });
  };
  return Referral;
};