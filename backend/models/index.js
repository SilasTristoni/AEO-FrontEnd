'use strict';

const sequelize = require('../config/database');

// 1. Importar todos os seus modelos
const User = require('./users');
const Category = require('./categories');
const Product = require('./products');
const Order = require('./orders'); 
const OrderProduct = require('./orderProduct');

// 2. Montar um objeto 'db' que será nosso ponto central de acesso
const db = {
  sequelize, // A instância da conexão
  User,
  Category,
  Product,
  Order,
  OrderProduct
};

// 3. Definir TODAS as associações usando o objeto 'db'
//    Isto inclui a lógica do seu antigo arquivo 'association.js'

// Associação: Categoria <-> Produto (Um-para-Muitos)
db.Category.hasMany(db.Product, { foreignKey: 'categoryId', as: 'products' });
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

// Associação: Pedido <-> Produto (Muitos-para-Muitos)
db.Order.belongsToMany(db.Product, {
  through: db.OrderProduct, // A tabela de junção
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

// 4. Exportar o objeto 'db' completo
module.exports = db;