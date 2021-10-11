'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      productName:{
        type: Sequelize.STRING,
        allowNull: false
      },
      product_price: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deliveryAmount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isStatus: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      // isAccepted: {
      //   type: Sequelize.BOOLEAN
      // },
      // isShipped: {
      //   type: Sequelize.BOOLEAN
      // },
      // isRejected: {
      //   type: Sequelize.BOOLEAN
      // },
      // isCancel: {
      //   type: Sequelize.BOOLEAN
      // },
      // isFailed: {
      //   type: Sequelize.BOOLEAN
      // },
      // isDelivered: {
      //   type: Sequelize.BOOLEAN
      // },
      // isModified: {
      //   type: Sequelize.BOOLEAN
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt:{
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};