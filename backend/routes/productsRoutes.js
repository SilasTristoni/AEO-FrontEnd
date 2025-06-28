const express = require('express');
const router = express.Router();
const ProductsControllers = require('../controllers/productsControllers.js');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, ProductsControllers.findAllProducts);
router.post('/', authenticateToken, ProductsControllers.createProduct);
router.get('/:id', authenticateToken, ProductsControllers.findProductById);
router.put('/:id', authenticateToken, ProductsControllers.updateProduct);
router.delete('/:id', authenticateToken, ProductsControllers.deleteProduct);

module.exports = router;