import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import EntityForm from '../components/ui/EntityForm'; // Importando nosso formulário genérico

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Precisamos das categorias para o select

  // O estado agora é um objeto para ser compatível com o formulário
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    categoryId: '',
  });

  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca tanto os produtos quanto as categorias
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const productsResponse = await api.get('/products');
      setProducts(productsResponse.data);

      const categoriesResponse = await api.get('/categories');
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Converte os valores para os tipos corretos antes de enviar
    const productData = {
      ...currentProduct,
      price: parseFloat(currentProduct.price),
      categoryId: parseInt(currentProduct.categoryId, 10),
    };

    if (editingProductId) {
      await api.put(`/products/${editingProductId}`, productData);
      toast.success('Produto atualizado com sucesso!');
    } else {
      await api.post('/products', productData);
      toast.success('Produto criado com sucesso!');
    }
    
    handleCancelEdit();
    fetchData();
  };
  
  const handleEdit = (product) => {
    setEditingProductId(product.id);
    // Garante que os valores que vão para o formulário são strings
    setCurrentProduct({
        name: product.name,
        price: String(product.price),
        categoryId: String(product.categoryId),
    });
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setCurrentProduct({ name: '', price: '', categoryId: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await api.delete(`/products/${id}`);
      toast.success('Produto excluído com sucesso!');
      fetchData();
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }
  
  // Definimos os campos para o formulário de Produtos
  // Incluindo um campo do tipo 'select' para as categorias!
  const productFields = [
    { name: 'name', label: 'Produto', type: 'text' },
    { name: 'price', label: 'Preço', type: 'number' },
    { 
      name: 'categoryId', 
      label: 'Categoria', 
      type: 'select', 
      options: categories.map(cat => ({ value: cat.id, label: cat.name }))
    }
  ];

  return (
    <div className="page-container">
      <h1>Gerenciar Produtos</h1>

      <EntityForm
        entity={currentProduct}
        setEntity={setCurrentProduct}
        fields={productFields}
        onSubmit={handleSubmit}
        isEditing={!!editingProductId}
        onCancelEdit={handleCancelEdit}
        submitButtonText={editingProductId ? 'Atualizar Produto' : 'Criar Produto'}
      />

      <div className="entity-list">
        <h2>Produtos Existentes</h2>
        <div className="item-list">
            {products.map(product => (
            <div key={product.id} className="item-card">
                <h4>{product.name}</h4>
                <p>Preço: R$ {product.price}</p>
                {/* Mostra o nome da categoria em vez do ID */}
                <p>Categoria: {categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</p>
                <div className="actions">
                <button onClick={() => handleEdit(product)}>Editar</button>
                <button onClick={() => handleDelete(product.id)} className="delete-button">Excluir</button>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Products;