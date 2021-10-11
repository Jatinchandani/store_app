'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class businessDevice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  businessDevice.init({
    business_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'businessDevice',
  });
  return businessDevice;
};