const { Order, Product, User, OrderProduct } = require('../models');
const asyncHandler = require('express-async-handler');

// @desc    Criar um novo pedido
// @route   POST /orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res) => {
    // A requisição deve conter um array de produtos: [{ productId: 1, quantity: 2 }]
    const { products } = req.body;
    const userId = req.user.id; // Pega o ID do usuário logado a partir do token (middleware)

    if (!products || !Array.isArray(products) || products.length === 0) {
        res.status(400);
        throw new Error('Uma lista de produtos é obrigatória para criar um pedido.');
    }

    // Cria o pedido associado ao usuário logado
    const newOrder = await Order.create({ userId });

    // Adiciona cada produto ao pedido com sua respectiva quantidade
    for (const product of products) {
        await newOrder.addProduct(product.productId, {
            through: { quantity: product.quantity }
        });
    }

    // Busca o pedido recém-criado com todos os seus produtos para retornar ao cliente
    const result = await Order.findByPk(newOrder.id, {
        include: [{
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'price'],
            through: { attributes: ['quantity'] }
        }]
    });

    res.status(201).json(result);
});


// @desc    Obter os pedidos do usuário logado
// @route   GET /orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.id; // ID do usuário do token

    const orders = await Order.findAll({
        where: { userId },
        include: [{
            model: Product,
            as: 'products',
            attributes: ['id', 'name', 'price'],
            through: { attributes: ['quantity'] }
        }],
        order: [['createdAt', 'DESC']] // Ordena pelos mais recentes
    });

    res.status(200).json(orders);
});


// @desc    Obter um pedido específico pelo ID
// @route   GET /orders/:id
// @access  Private (um admin poderia ver qualquer pedido, mas aqui vamos assumir que o usuário só pode ver os seus)
exports.getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
        where: { id, userId }, // Garante que o usuário só possa ver seu próprio pedido
        include: [{
            model: Product,
            as: 'products',
            through: { attributes: ['quantity'] }
        }]
    });

    if (!order) {
        res.status(404);
        throw new Error('Pedido não encontrado ou não pertence a este usuário.');
    }

    res.status(200).json(order);
});

// Nota: As funções de update e delete de pedidos podem ser bastante complexas
// (cancelamento, estorno, etc.) e foram omitidas para simplificar,
// mas podem ser adicionadas aqui seguindo o mesmo padrão.