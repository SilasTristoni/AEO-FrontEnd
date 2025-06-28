import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { toast } from 'react-toastify';
import EntityForm from '../components/ui/EntityForm'; // <-- 1. Importamos o novo componente

function Categories() {
  const [categories, setCategories] = useState([]);
  
  // 2. O estado agora é um objeto, para ser compatível com o formulário genérico
  const [currentCategory, setCurrentCategory] = useState({ name: '' });
  
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      // O interceptor já mostra o toast, mas podemos logar para debug
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingCategoryId) { // Se está editando
      await api.put(`/categories/${editingCategoryId}`, currentCategory);
      toast.success('Categoria atualizada com sucesso!');
    } else { // Se está criando
      await api.post('/categories', currentCategory);
      toast.success('Categoria criada com sucesso!');
    }
    
    handleCancelEdit(); // Limpa o formulário e reseta o estado
    fetchCategories();   // Recarrega a lista
  };

  const handleEdit = (category) => {
    setEditingCategoryId(category.id);
    setCurrentCategory({ name: category.name }); // Preenche o formulário com os dados
  };
  
  const handleCancelEdit = () => {
      setEditingCategoryId(null);
      setCurrentCategory({ name: '' }); // Limpa o formulário
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Isso não pode ser desfeito.')) {
      await api.delete(`/categories/${id}`);
      toast.success('Categoria excluída com sucesso!');
      fetchCategories();
    }
  };

  if (loading) {
    return <div>Carregando categorias...</div>;
  }

  // 3. Definimos os campos que o nosso formulário de categoria terá
  const categoryFields = [
    { name: 'name', label: 'Categoria', type: 'text' }
  ];

  return (
    <div className="page-container">
      <h1>Gerenciar Categorias</h1>

      {/* 4. Usamos o EntityForm aqui! */}
      <EntityForm
        entity={currentCategory}
        setEntity={setCurrentCategory}
        fields={categoryFields}
        onSubmit={handleSubmit}
        isEditing={!!editingCategoryId}
        onCancelEdit={handleCancelEdit}
        submitButtonText={editingCategoryId ? 'Atualizar Categoria' : 'Criar Categoria'}
      />

      <div className="entity-list">
        <h2>Categorias Existentes</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <span>{category.name}</span>
              <div className="actions">
                <button onClick={() => handleEdit(category)}>Editar</button>
                <button onClick={() => handleDelete(category.id)} className="delete-button">Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Categories;