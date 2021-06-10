'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChurchUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChurchUnit.belongsToMany(models.User, {
        as: 'users',
        through: 'MembersUnit',
        foreignKey: 'unit_id'
      });
    }
  };
  ChurchUnit.init({
    unit_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChurchUnit',
  });
  return ChurchUnit;
};