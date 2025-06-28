const { DataTypes } = require('sequelize');
const database = require('../config/database');
const Category = require('./categories');

const Product = database.db.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id'
        }
    }
});

Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });


module.exports = Product;