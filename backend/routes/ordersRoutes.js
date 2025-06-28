const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById
} = require('../controllers/ordersControllers');
const authenticateToken = require('../middleware/authenticateToken');

// O middleware de autenticação será aplicado a todas as rotas de pedidos
router.use(authenticateToken);

// Rota para criar um novo pedido
// POST /orders
router.post('/', createOrder);

// Rota para buscar todos os pedidos do usuário logado
// GET /orders/myorders
router.get('/myorders', getMyOrders);

// Rota para buscar um pedido específico do usuário pelo ID do pedido
// GET /orders/:id
router.get('/:id', getOrderById);

module.exports = router;