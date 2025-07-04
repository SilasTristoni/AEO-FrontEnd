const express = require('express');
const router = express.Router();
const ProductsControllers = require('../controllers/productsControllers');
const authenticateToken = require('../middleware/authenticateToken');

// LOG DE DEPURAÇÃO 1: Confirma que este arquivo foi carregado.
console.log('[DEBUG] Arquivo de rotas de produtos (productsRoutes.js) foi carregado.');

// --- Definição das Rotas ---
router.get('/', authenticateToken, ProductsControllers.findAllProducts);
router.post('/', authenticateToken, ProductsControllers.createProduct);
router.get('/:id', authenticateToken, ProductsControllers.findProductById);
router.put('/:id', authenticateToken, ProductsControllers.updateProduct);
router.delete('/:id', authenticateToken, ProductsControllers.deleteProduct);

// LOG DE DEPURAÇÃO 2: Mostra todas as rotas que foram registradas neste arquivo.
console.log('[DEBUG] Rotas registradas em /products:');
router.stack.forEach(layer => {
    if (layer.route) {
        console.log(`- ${Object.keys(layer.route.methods).join(', ').toUpperCase()} ${layer.route.path}`);
    }
});

module.exports = router;