import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Products = () => {
    // States para a lista de produtos e categorias
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // States para o formulário
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    
    // State para controlar a edição
    const [editingProduct, setEditingProduct] = useState(null);

    // States de controle da interface
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Função para buscar os dados iniciais (produtos e categorias)
    const fetchData = async () => {
        setLoading(true);
        try {
            // Faz as duas requisições em paralelo para carregar a página mais rápido
            const [productsResponse, categoriesResponse] = await Promise.all([
                api.get('/products'), // Pega a lista de todos os produtos
                api.get('/categories') // Pega a lista de todas as categorias para o dropdown
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

    // useEffect para chamar a função de busca de dados apenas uma vez
    useEffect(() => {
        fetchData();
    }, []);

    // Limpa o formulário e reseta o modo de edição
    const resetForm = () => {
        setName('');
        setPrice('');
        setCategoryId('');
        setEditingProduct(null);
        setError('');
    };

    // Prepara o formulário para editar um produto
    const handleEdit = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price);
        setCategoryId(product.categoryId);
    };

    // Deleta um produto
    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchData(); // Recarrega os dados da página
            } catch (err) {
                setError("Erro ao deletar o produto.");
                console.error(err);
            }
        }
    };

    // Envia o formulário para criar ou atualizar um produto
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price || !categoryId) {
            setError("Todos os campos são obrigatórios.");
            return;
        }
        
        // Garante que os tipos de dados estão corretos para a API
        const productData = { name, price: parseFloat(price), categoryId: parseInt(categoryId) };

        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, productData);
            } else {
                await api.post('/products', productData);
            }
            resetForm();
            fetchData(); // Recarrega os dados da página
        } catch (err) {
            setError("Ocorreu um erro ao salvar o produto.");
            console.error(err);
        }
    };

    if (loading) {
        return <p>Carregando dados da página...</p>;
    }

    return (
        <div>
            <h2>Gerenciar Produtos</h2>

            <div className="form-container">
                <h3>{editingProduct ? 'Editar Produto' : 'Criar Novo(a) Produto'}</h3>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Produto" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="number" placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" />
                    
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                        <option value="" disabled>Selecione uma categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <button type="submit">{editingProduct ? 'Atualizar' : 'Adicionar'}</button>
                    {editingProduct && <button type="button" onClick={resetForm}>Cancelar</button>}
                    {error && <p className="error">{error}</p>}
                </form>
            </div>

            <div className="item-list">
                {products.map(product => (
                    <div key={product.id} className="item-card">
                        <h4>{product.name}</h4>
                        <p>Preço: R$ {product.price}</p>
                        {/* ALTERAÇÃO APLICADA AQUI */}
                        <p>Categoria: {product.category?.name || 'Sem categoria'}</p>
                        <div>
                            <button onClick={() => handleEdit(product)}>Editar</button>
                            <button onClick={() => handleDelete(product.id)}>Deletar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;