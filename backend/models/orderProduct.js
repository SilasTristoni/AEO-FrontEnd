const { DataTypes } = require('sequelize');
const database = require('../config/database');

const OrderProduct = database.define('OrderProduct', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
});

module.exports = OrderProduct;