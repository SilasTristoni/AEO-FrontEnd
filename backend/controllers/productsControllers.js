const Products = require('../models/products');

class ProductsControllers {
    static async createProduct(req, res) {
        try {
            const { name, price, categoryId } = req.body;

            if (!name || !price || !categoryId) {
                return res.status(400).json({ message: 'Nome, preço e categoryId são obrigatórios' });
            }

            const product = await Products.create({
                name,
                price,
                categoryId
            });
            return res.status(201).json(product);
        }
        catch (err) {
            return res.status(500).json({ message: 'Erro ao criar produto', error: err.message });
        }
    }
    static async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, price, categoryId } = req.body;
            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            if(name) product.name = name;
            if(price) product.price = price;
            if(categoryId) product.categoryId = categoryId;
            await product.save();
            return res.status(200).json(product);
        }
        catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar produto', error: err.message });
        }
    }
    static async deleteProduct(req, res) {
        try {
            const { id } = req.params;
            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            await product.destroy();
            return res.status(204).send();
        }
        catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar produto', error: err.message });
        }
    }
    static async findAllProducts(req, res) {
        try {
            const products = await Products.findAll();
            return res.status(200).json(products);
        }
        catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar produtos', error: err.message });
        }
    }
    static async findProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Products.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json(product);
        }
        catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar produto', error: err.message });
        }
    }
}
module.exports = ProductsControllers;