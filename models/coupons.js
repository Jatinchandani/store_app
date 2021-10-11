'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coupons extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  coupons.init({
    user_id: DataTypes.INTEGER,
    couponCode: DataTypes.STRING,
    couponUses_per_user: DataTypes.INTEGER,
    discountType: DataTypes.STRING,
    percent: DataTypes.STRING,
    minimumOrderAmount: DataTypes.INTEGER,
    maximumDiscount: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'coupons',
  });
  return coupons;
};