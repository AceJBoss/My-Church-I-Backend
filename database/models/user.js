'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.UserType, {
        foreignKey: 'user_type_id',
        onDelete: 'CASCADE',
      });
      User.belongsToMany(models.ChurchUnit, {
        as: 'units',
        through: 'MembersUnit',
        foreignKey: 'user_id'
      });
      User.hasMany(models.ScheduleCounselling, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      User.belongsTo(models.Lga, {
        foreignKey: 'lga_id',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Pledge, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });

      User.hasMany(models.CounselFeedback, {
        foreignKey: 'pastor_id',
        onDelete: 'CASCADE',
      });

    }
  };
  User.init({
    title: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.STRING,
    marital_status: DataTypes.ENUM('Single', 'Married', 'Divorced'),
    dob: DataTypes.STRING,
    year: DataTypes.INTEGER,
    image_url: DataTypes.TEXT,
    image_key: DataTypes.TEXT,
    password: DataTypes.STRING,
    lga_id: DataTypes.INTEGER,
    user_type_id: DataTypes.INTEGER,
    status: DataTypes.ENUM('Active', 'Suspended')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};