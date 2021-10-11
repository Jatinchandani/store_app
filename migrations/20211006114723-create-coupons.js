'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      couponCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      couponUses_per_user: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      discountType: {
        allowNull: false,
        type: Sequelize.STRING
      },
      percent: {
        allowNull: false,
        type: Sequelize.STRING
      },
      minimumOrderAmount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      maximumDiscount: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('coupons');
  }
};