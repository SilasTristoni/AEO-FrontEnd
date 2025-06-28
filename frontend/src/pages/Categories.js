import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // Guarda a categoria que está sendo editada
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  // Efeito para buscar as categorias quando o componente é montado
  useEffect(() => {
    const fetchCategories = async () => {
      if (!auth.token) {
        setError("Você precisa estar logado para ver as categorias.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
        setError('');
      } catch (err) {
        setError("Falha ao carregar as categorias. Verifique sua autenticação.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [auth.token]); // Roda novamente se o token mudar

  // Função para lidar com o envio do formulário (criar ou atualizar)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("O nome da categoria é obrigatório.");
      return;
    }

    const categoryData = { name };

    try {
      if (editingCategory) {
        // Atualiza a categoria existente
        const response = await api.put(`/categories/${editingCategory.id}`, categoryData);
        setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
      } else {
        // Cria uma nova categoria
        const response = await api.post('/categories', categoryData);
        setCategories([...categories, response.data]);
      }
      resetForm();
    } catch (err) {
      setError("Ocorreu um erro ao salvar a categoria.");
      console.error(err);
    }
  };

  // Função para deletar uma categoria
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (err) {
        setError("Ocorreu um erro ao deletar a categoria.");
        console.error(err);
      }
    }
  };

  // Prepara o formulário para edição
  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
  };

  // Limpa o formulário
  const resetForm = () => {
    setName('');
    setEditingCategory(null);
    setError('');
  };

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  return (
    <div>
      <h2>Gerenciar Categorias</h2>

      {error && <p className="error">{error}</p>}

      <div className="form-container">
        <h3>{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">{editingCategory ? 'Atualizar' : 'Criar'}</button>
          {editingCategory && <button type="button" onClick={resetForm}>Cancelar</button>}
        </form>
      </div>

      <div className="item-list">
        {categories.map(category => (
          <div key={category.id} className="item-card">
            <h4>{category.name} (ID: {category.id})</h4>
            <div>
              <button onClick={() => handleEdit(category)}>Editar</button>
              <button onClick={() => handleDelete(category.id)}>Deletar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;