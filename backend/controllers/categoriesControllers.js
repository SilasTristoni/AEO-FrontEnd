const Categories = require('../models/categories');
const Products = require('../models/products');

class CategoriesControllers {
    static async createCategory(req, res) {
        try {
            console.log('Backend recebeu em /categories (POST):', req.body);
            const { name } = req.body;

            if (!name || typeof name !== 'string' || name.trim() === '') {
                console.error('Validação falhou: o nome da categoria está ausente ou inválido.');
                return res.status(400).json({ message: 'O campo "name" é obrigatório e não pode ser vazio.' });
            }

            const newCategory = await Categories.create({ name: name.trim() });
            return res.status(201).json(newCategory);

        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: 'Uma categoria com este nome já existe.' });
            }
            console.error("Erro interno no servidor ao criar categoria:", err);
            return res.status(500).json({ message: 'Erro interno ao criar categoria.', error: err.message });
        }
    }

    static async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const category = await Categories.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoria não encontrada' });
            }
            category.name = name;
            await category.save();
            return res.status(200).json(category);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar categoria', error: err.message });
        }
    }

    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await Categories.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoria não encontrada' });
            }
            await category.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar categoria', error: err.message });
        }
    }

    static async findAllCategories(req, res) {
        try {
            const categories = await Categories.findAll();
            return res.status(200).json(categories);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar categorias', error: err.message });
        }
    }

    static async findCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await Categories.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Categoria não encontrada' });
            }
            return res.status(200).json(category);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar categoria', error: err.message });
        }
    }

    static async findProductsByCategoryId(req, res) {
        try {
            const { id } = req.params;
            const category = await Categories.findByPk(id, {
                include: {
                    model: Products,
                    as: 'products'
                }
            });
            if (!category) {
                return res.status(404).json({ message: 'Categoria não encontrada' });
            }
            return res.status(200).json(category.products);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar produtos da categoria', error: err.message });
        }
    }
}

module.exports = CategoriesControllers;