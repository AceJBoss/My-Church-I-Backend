'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeliveryDropPoint = sequelize.define('DeliveryDropPoint', {
    image_url: DataTypes.TEXT,
    image_key: DataTypes.TEXT,
    delivery_job_id: DataTypes.BIGINT,
    droppoint_lat: DataTypes.STRING,
    droppoint_lng: DataTypes.STRING,
    droppoint_address: DataTypes.TEXT,
    description: DataTypes.TEXT,
    item_name: DataTypes.TEXT,
    item_type: DataTypes.STRING,
    is_delivered: {
      type: DataTypes.ENUM('0','1'),
      defaultValue:'0'
    },
    status: {
      type: DataTypes.ENUM('pending', 'delivered'),
      defaultValue:'pending'
    }
  }, {});
  DeliveryDropPoint.associate = function(models) {
    // associations can be defined here
    DeliveryDropPoint.belongsTo(models.DeliveryJob, {
      foreignKey: 'delivery_job_id',
      onDelete: 'CASCADE',
    });
  };
  return DeliveryDropPoint;
};