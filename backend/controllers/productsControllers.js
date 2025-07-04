const { Product, Category } = require('../models'); // Importa do novo /models/index.js

class ProductsControllers {
    // Lista todos os produtos e inclui o nome da categoria de cada um
    static async findAllProducts(req, res) {
        try {
            const products = await Product.findAll({
                include: {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            });
            return res.status(200).json(products);
        } catch (err) {
            console.error("--- ERRO EM findAllProducts ---", err);
            return res.status(500).json({ message: 'Erro interno ao buscar produtos', error: err.message });
        }
    }

    // Cria um novo produto
    static async createProduct(req, res) {
        try {
            const { name, price, categoryId } = req.body;
            if (!name || !price || !categoryId) {
                return res.status(400).json({ message: 'Nome, preço e ID da categoria são obrigatórios' });
            }
            const newProduct = await Product.create({ name, price, categoryId });
            return res.status(201).json(newProduct);
        } catch (err) {
            return res.status(500).json({ message: 'Erro interno ao criar produto', error: err.message });
        }
    }

    // Atualiza um produto existente
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, price, categoryId } = req.body;
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            if (name) product.name = name;
            if (price) product.price = price;
            if (categoryId) product.categoryId = categoryId;
            await product.save();
            return res.status(200).json(product);
        } catch (err) {
            return res.status(500).json({ message: 'Erro interno ao atualizar produto', error: err.message });
        }
    }

    // Deleta um produto
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            await product.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro interno ao deletar produto', error: err.message });
        }
    }

    // Busca um único produto por ID
    static async findProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, {
                include: {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            });
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json(product);
        } catch (err) {
            return res.status(500).json({ message: 'Erro interno ao buscar produto', error: err.message });
        }
    }
}

module.exports = ProductsControllers;