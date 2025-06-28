const { DataTypes } = require('sequelize');
const database = require('../config/database');
const User = require('./users');

const Order = database.db.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
});

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Order;