const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Order = database.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Order;