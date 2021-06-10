'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Lga.belongsTo(models.State, {
        foreignKey: 'state_id',
        onDelete: 'CASCADE',
      });
      Lga.hasMany(models.User, {
        foreignKey: 'lga_id',
        onDelete: 'CASCADE',
      });
    }
  };
  Lga.init({
    lga: DataTypes.STRING,
    state_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lga',
  });
  return Lga;
};