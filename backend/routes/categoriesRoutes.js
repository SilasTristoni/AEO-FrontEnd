const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoriesControllers');
const authMiddleware = require('../middleware/authenticateToken'); 
router.use(authMiddleware);

router.route('/')
    .get(getAllCategories)
    .post(createCategory);

router.route('/:id')
    .get(getCategoryById)
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;