'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  orders.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    product_price: DataTypes.STRING,
    quantity: DataTypes.STRING,
    deliveryAmount: DataTypes.INTEGER,
    isAccepted: DataTypes.BOOLEAN,
    isShipped: DataTypes.BOOLEAN,
    isRejected: DataTypes.BOOLEAN,
    isCancel: DataTypes.BOOLEAN,
    isFailed: DataTypes.BOOLEAN,
    isDelivered: DataTypes.BOOLEAN,
    isModified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'orders',
  });
  return orders;
};