'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    image_url: {
      type: DataTypes.TEXT,
      allowNull:true
    },
    image_key: {
      type: DataTypes.TEXT,
      allowNull:true
    },
    device_token: {
      type: DataTypes.TEXT,
      allowNull:true
    },
    first_name: DataTypes.TEXT,
    last_name: DataTypes.TEXT,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    ref_code: {
      type: DataTypes.STRING,
      allowNull:true
    },
    password: DataTypes.STRING,
    user_type_id: DataTypes.BIGINT,
    user_otp: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('Active', 'Pending', 'Suspended'),
      defaultValue: 'Pending'
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsTo(models.UserType, {
      foreignKey: 'user_type_id',
      onDelete: 'CASCADE',
    });

    User.hasOne(models.UserWallet, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Referral, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    User.hasOne(models.Organization, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.Referral, {
      foreignKey: 'referee_id',
      onDelete: 'CASCADE',
    });

    User.hasOne(models.VirtualAccount, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    User.hasMany(models.DeliveryJob, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });

    User.hasOne(models.Driver, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };
  return User;
};