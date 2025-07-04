const express = require('express');
const router = express.Router();
const CategoriesControllers = require('../controllers/categoriesControllers');
const authenticateToken = require('../middleware/authenticateToken.js');

// Rotas para Categorias
router.get('/', authenticateToken, CategoriesControllers.findAllCategories);
router.post('/', authenticateToken, CategoriesControllers.createCategory);
router.get('/:id', authenticateToken, CategoriesControllers.findCategoryById);
router.put('/:id', authenticateToken, CategoriesControllers.updateCategory);
router.delete('/:id', authenticateToken, CategoriesControllers.deleteCategory);

// Rota para buscar produtos de uma categoria específica
router.get('/:id/products', authenticateToken, CategoriesControllers.findProductsByCategoryId);

module.exports = router;