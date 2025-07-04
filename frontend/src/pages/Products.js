import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productData, setProductData] = useState({ name: '', price: '', categoryId: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsResponse, categoriesResponse] = await Promise.all([
                api.get('/products'),
                api.get('/categories')
            ]);
            setProducts(productsResponse.data);
            setCategories(categoriesResponse.data);
            setError('');
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError("Não foi possível carregar os dados. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setProductData({ name: '', price: '', categoryId: '' });
        setEditingProduct(null);
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setProductData({
            name: product.name,
            price: product.price,
            categoryId: product.categoryId,
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData();
            } catch (err) {
                setError("Erro ao deletar o produto.");
                console.error(err);
            }
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, price, categoryId } = productData;
        if (!name || !price || !categoryId) {
            setError("Todos os campos são obrigatórios.");
            return;
        }
        const dataToSend = { ...productData, price: parseFloat(price), categoryId: parseInt(categoryId) };

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, dataToSend);
            } else {
                await api.post('/products', dataToSend);
            }
            resetForm();
            fetchData();
        } catch (err) {
            setError("Ocorreu um erro ao salvar o produto.");
            console.error(err);
        }
    };

    if (loading) return <p className="page-container">Carregando dados da página...</p>;

    return (
        <div className="page-container">
            <h1 className="page-header">Gerenciar Produtos</h1>

            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <form onSubmit={handleSubmit}>
                    <h3>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                    <div className="form-group">
                        <label htmlFor="name">Nome do Produto</label>
                        <input type="text" name="name" id="name" className="form-control" placeholder="Ex: Coca-Cola 2L" value={productData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Preço (R$)</label>
                        <input type="number" name="price" id="price" className="form-control" placeholder="Ex: 9.99" value={productData.price} onChange={handleInputChange} required step="0.01" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoryId">Categoria</label>
                        <select name="categoryId" id="categoryId" className="form-control" value={productData.categoryId} onChange={handleInputChange} required>
                            <option value="" disabled>Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{editingProduct ? 'Atualizar' : 'Adicionar'}</button>
                        {editingProduct && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancelar</button>}
                    </div>
                </form>
            </div>

            <h2>Produtos Existentes</h2>
            <div className="card-grid"> {/* <--- Classe para a grade de produtos */}
                {products.map(product => (
                    <div key={product.id} className="card"> {/* <--- Cada produto é um card */}
                        <h4 style={{marginTop: 0}}>{product.name}</h4>
                        <p>Preço: R$ {product.price}</p>
                        <p>Categoria: {categories.find(c => c.id === product.categoryId)?.name || 'Sem categoria'}</p>
                        <div className="btn-group">
                            <button onClick={() => handleEdit(product)} className="btn btn-secondary">Editar</button>
                            <button onClick={() => handleDelete(product.id)} className="btn btn-danger">Deletar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;