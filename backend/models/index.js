const User = require('./users');
const Category = require('./categories');
const Product = require('./products');
const Order = require('./orders');
const OrderProduct = require('./orderProduct');

// Relação Categoria -> Produto
Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });
Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

// Relação Usuário -> Pedido
User.hasMany(Order, { as: 'orders', foreignKey: 'userId' });
Order.belongsTo(User, { as: 'user', foreignKey: 'userId' });

// Relação Pedido <-> Produto
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', as: 'products' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId', as: 'orders' });

// Exporta tudo para ser usado no resto da aplicação
module.exports = {
  User,
  Category,
  Product,
  Order,
  OrderProduct,
};