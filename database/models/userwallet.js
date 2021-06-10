'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserWallet = sequelize.define('UserWallet', {
    user_id: DataTypes.BIGINT,
    balance: DataTypes.DOUBLE
  }, {});
  UserWallet.associate = function(models) {
    // associations can be defined here
    UserWallet.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };
  return UserWallet;
};