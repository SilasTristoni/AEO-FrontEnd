const { DataTypes } = require('sequelize');
const database = require('../config/database');

const OrderProduct = database.db.define('OrderProduct', {
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

module.exports = OrderProduct;