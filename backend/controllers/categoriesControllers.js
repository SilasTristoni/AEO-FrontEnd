const { Category, Product } = require('../models'); // Importe o Product também para a verificação

// Função auxiliar para evitar repetição de try-catch em rotas assíncronas.
// Ela pega uma função, a executa, e se houver um erro, o passa para o `next()`.
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// --- CRUD OPERATIONS ---

// Criar uma nova categoria
exports.createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400); // Bad Request
        throw new Error('O nome da categoria é obrigatório.');
    }
    const category = await Category.create({ name });
    res.status(201).json(category);
});

// Obter todas as categorias
exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.findAll({
        order: [['name', 'ASC']], // Ordena por nome
    });
    res.status(200).json(categories);
});

// Obter uma única categoria pelo ID
exports.getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
        res.status(404); // Not Found
        throw new Error('Categoria não encontrada.');
    }
    res.status(200).json(category);
});

// Atualizar uma categoria
exports.updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
        res.status(404);
        throw new Error('Categoria não encontrada.');
    }

    if (!name) {
        res.status(400);
        throw new Error('O nome da categoria é obrigatório.');
    }

    category.name = name;
    await category.save();

    res.status(200).json(category);
});

// Excluir uma categoria
exports.deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
        res.status(404);
        throw new Error('Categoria não encontrada.');
    }
    
    // VERIFICAÇÃO EXTRA: Não permitir excluir categoria se houver produtos associados a ela
    const productsInCategory = await Product.count({ where: { categoryId: id } });
    if (productsInCategory > 0) {
        res.status(400);
        throw new Error('Não é possível excluir a categoria, pois existem produtos associados a ela.');
    }

    await category.destroy();
    res.status(200).json({ message: 'Categoria excluída com sucesso.' });
});