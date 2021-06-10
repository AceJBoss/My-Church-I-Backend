'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CounselFeedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CounselFeedback.belongsTo(models.ScheduleCounselling, {
        foreignKey: 'counsel_id',
        onDelete: 'CASCADE',
      });
      CounselFeedback.belongsTo(models.User, {
        foreignKey: 'pastor_id',
        onDelete: 'CASCADE',
      });

    }
  };
  CounselFeedback.init({
    counsel_id: DataTypes.INTEGER,
    pastor_id: DataTypes.INTEGER,
    feedback: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'CounselFeedback',
  });
  return CounselFeedback;
};