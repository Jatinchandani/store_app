'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderCustomers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  orderCustomers.init({
    order_id: DataTypes.INTEGER,
    business_id: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    mobileNumber: DataTypes.INTEGER,
    address: DataTypes.STRING,
    pincode: DataTypes.INTEGER,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    paymentBy: DataTypes.STRING,
    orderStatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'orderCustomers',
  });
  return orderCustomers;
};