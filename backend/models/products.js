const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Product = database.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // O campo 'categoryId' será adicionado pela associação no arquivo 'models/index.js'
});

module.exports = Product;