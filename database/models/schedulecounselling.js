'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScheduleCounselling extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ScheduleCounselling.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      });
      ScheduleCounselling.hasMany(models.CounselFeedback, {
        foreignKey: 'counsel_id',
        onDelete: 'CASCADE',
      });
    }
  };
  ScheduleCounselling.init({
    message: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ScheduleCounselling',
  });
  return ScheduleCounselling;
};