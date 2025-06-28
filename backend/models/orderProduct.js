const { DataTypes } = require('sequelize');
const database = require('../config/database'); // 'database' é a conexão direta

// CORREÇÃO: Usamos database.define() em vez de database.db.define()
const OrderProduct = database.define('OrderProduct', {
    // Este modelo serve como a tabela intermediária para a relação Muitos-para-Muitos
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    // As chaves estrangeiras 'orderId' and 'productId'
    // são adicionadas automaticamente pelo Sequelize
    // quando definimos a associação no 'models/index.js'
});

module.exports = OrderProduct;