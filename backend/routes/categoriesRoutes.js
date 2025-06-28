const express = require('express');
const router = express.Router();
const CategoriesControllers = require('../controllers/categoriesControllers.js');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', authenticateToken, CategoriesControllers.findAllCategories);
router.post('/', authenticateToken, CategoriesControllers.createCategory);
router.get('/:id', authenticateToken, CategoriesControllers.findCategoryById);
router.get('/:id/products', authenticateToken, CategoriesControllers.findProductsByCategoryId);
router.put('/:id', authenticateToken, CategoriesControllers.updateCategory);
router.delete('/:id', authenticateToken, CategoriesControllers.deleteCategory);

module.exports = router;