function applyAssociations(sequelize) {
    const { User, Category, Product, Order, OrderProduct } = sequelize.models;

    // Relação Usuário -> Pedido (Um para Muitos)
    User.hasMany(Order, { as: 'orders', foreignKey: 'userId' });
    Order.belongsTo(User, { as: 'user', foreignKey: 'userId' });

    // Relação Categoria -> Produto (Um para Muitos)
    Category.hasMany(Product, { as: 'products', foreignKey: 'categoryId' });
    Product.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

    // Relação Pedido <-> Produto (Muitos para Muitos)
    Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', as: 'products' });
    Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId', as: 'orders' });
}

module.exports = { applyAssociations };