'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productVariants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  productVariants.init({
    product_id: DataTypes.INTEGER,
    variant_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'productVariants',
  });
  return productVariants;
};