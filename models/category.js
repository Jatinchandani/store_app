'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  category.init({
    product_id: DataTypes.INTEGER,
    business_id: DataTypes.INTEGER,
    activated: DataTypes.STRING,
    deactivated: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'category',
  });
  return category;
};