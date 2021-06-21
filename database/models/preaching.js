'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preaching extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Preaching.init({
    title: DataTypes.STRING,
    video_url: DataTypes.TEXT,
    video_key: DataTypes.TEXT,
    preacher: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Preaching',
  });
  return Preaching;
};