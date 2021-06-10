'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserType = sequelize.define('UserType', {
    user_type: DataTypes.STRING
  }, {});
  UserType.associate = function(models) {
    // associations can be defined here
    UserType.hasMany(models.User, {
      foreignKey: 'user_type_id',
      onDelete: 'CASCADE',
    });
  };
  return UserType;
};