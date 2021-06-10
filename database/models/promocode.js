'use strict';
module.exports = (sequelize, DataTypes) => {
  const PromoCode = sequelize.define('PromoCode', {
    promo_type: {
      type: DataTypes.ENUM('sponsored', 'system'),
      defaultValue:'system'
    },
    criteria: {
      type: DataTypes.ENUM('all', 'freshers', 'atmost 10', 'atmost 20', '30 above'),
      defaultValue:'all'
    },
    promo_code: DataTypes.STRING,
    duration: {
      type: DataTypes.ENUM('24 hours', '1 weeks', '2 weeks', '3 weeks', '4 weeks'),
      defaultValue:'24 hours'
    },
    discount: DataTypes.STRING
  }, {});
  PromoCode.associate = function(models) {
    // associations can be defined here
  };
  return PromoCode;
};