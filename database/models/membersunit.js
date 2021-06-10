'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MembersUnit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MembersUnit.belongsTo(models.User,{
        foreignKey:'user_id',
      })
      MembersUnit.belongsTo(models.ChurchUnit,{
        foreignKey:'unit_id',
      })
    }
  };
  MembersUnit.init({
    unit_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MembersUnit',
  });
  return MembersUnit;
};