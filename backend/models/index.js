'use strict';

const sequelize = require('../config/database');

// 1. Importar todos os modelos
const User = require('./users');
const Category = require('./categories');
const Product = require('./products');
const Order = require('./orders');
const OrderProduct = require('./orderProduct');

// 2. Montar o objeto 'db'
const db = {
  sequelize,
  User,
  Category,
  Product,
  Order,
  OrderProduct
};

// 3. Definir TODAS as associações
// Associação: Categoria <-> Produto
db.Category.hasMany(db.Product, { foreignKey: 'categoryId', as: 'products' });
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

// Associação: Pedido <-> Produto
db.Order.belongsToMany(db.Product, {
  through: db.OrderProduct,
  foreignKey: 'orderId',
  otherKey: 'productId',
  as: 'products'
});
db.Product.belongsToMany(db.Order, {
  through: db.OrderProduct,
  foreignKey: 'productId',
  otherKey: 'orderId',
  as: 'orders'
});

// Associação: Usuário <-> Pedido
db.User.hasMany(db.Order, { foreignKey: 'userId', as: 'orders' });
db.Order.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

// 4. Exportar o objeto 'db' corretamente
module.exports = db; // <-- CORREÇÃO AQUI