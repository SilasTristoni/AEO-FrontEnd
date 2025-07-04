const { DataTypes } = require('sequelize');
const database = require('../config/database');

const Product = database.define('Product', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    categoryId: { // A definição da chave estrangeira é ESSENCIAL aqui
        type: DataTypes.INTEGER,
        allowNull: true // Permite nulo para produtos sem categoria
    }
});

module.exports = Product;