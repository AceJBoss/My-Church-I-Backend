'use strict';
module.exports = (sequelize, DataTypes) => {
  const VirtualAccount = sequelize.define('VirtualAccount', {
    user_id: DataTypes.BIGINT,
    account_name: DataTypes.TEXT,
    bank_name: DataTypes.TEXT,
    account_no: DataTypes.STRING,
    order_ref: DataTypes.STRING,
    narration: DataTypes.TEXT,
    bvn: DataTypes.STRING
  }, {});
  VirtualAccount.associate = function(models) {
    // associations can be defined here
    VirtualAccount.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };
  return VirtualAccount;
};