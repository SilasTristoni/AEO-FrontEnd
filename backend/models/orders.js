const { DataTypes } = require('sequelize');
const database = require('../config/database'); // 'database' é a conexão direta

// CORREÇÃO: Usamos database.define() em vez de database.db.define()
const Order = database.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Define a data do pedido automaticamente
        allowNull: false,
    },
    // Você pode adicionar outras colunas aqui, como status, total, etc.
    // Ex: status: { type: DataTypes.STRING, defaultValue: 'Pending' }
    // Ex: total: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

module.exports = Order;