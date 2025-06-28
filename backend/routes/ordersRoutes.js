const express = require('express');
const router = express.Router();
const OrdersControllers = require('../controllers/ordersControllers');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, OrdersControllers.findAllOrders);
router.post('/', authenticateToken, OrdersControllers.createOrder);
router.get('/user/:id', authenticateToken, OrdersControllers.findOrdersByUserId);
router.get('/:id', authenticateToken, OrdersControllers.findOrderById);
router.put('/:id', authenticateToken, OrdersControllers.updateOrder);
router.delete('/:id', authenticateToken, OrdersControllers.deleteOrder);

module.exports = router;