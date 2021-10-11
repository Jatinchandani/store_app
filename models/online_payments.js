'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class online_payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  online_payments.init({
    user_id: DataTypes.INTEGER,
    upi_id: DataTypes.INTEGER,
    bankDetails: DataTypes.STRING,
    holderName: DataTypes.STRING,
    ifsc_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'online_payments',
  });
  return online_payments;
};