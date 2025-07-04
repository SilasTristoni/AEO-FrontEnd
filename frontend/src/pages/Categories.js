import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Importa nossa instância do Axios configurada!

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null); // Guarda a categoria que está sendo editada
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Efeito para buscar as categorias do backend quando o componente carregar
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // A requisição agora usa nossa instância 'api' e já envia o token
                const response = await api.get('/categories');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                setError('Erro ao carregar as categorias. Faça o login novamente.');
                console.error(err);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez

    // Limpa o formulário e o estado de edição
    const resetForm = () => {
        setName('');
        setEditingCategory(null);
        setError('');
    };

    // Prepara o formulário para editar uma categoria existente
    const handleEdit = (category) => {
        setEditingCategory(category);
        setName(category.name);
    };

    // Deleta uma categoria
    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
            try {
                await api.delete(`/categories/${id}`);
                setCategories(categories.filter(cat => cat.id !== id)); // Remove da lista local
            } catch (err) {
                setError('Erro ao deletar a categoria.');
                console.error(err);
            }
        }
    };

    // Lida com o envio do formulário (criação ou atualização)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("O nome da categoria é obrigatório.");
            return;
        }

        const categoryData = { name };

        try {
            if (editingCategory) {
                // Se estiver editando, faz uma requisição PUT
                const response = await api.put(`/categories/${editingCategory.id}`, categoryData);
                setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
            } else {
                // Se não, cria uma nova com uma requisição POST
                const response = await api.post('/categories', categoryData);
                setCategories([...categories, response.data]);
            }
            resetForm(); // Limpa o formulário após o sucesso
        } catch (err) {
            setError("Ocorreu um erro ao salvar a categoria. Verifique se o nome já existe.");
            console.error(err);
        }
    };

    if (loading) {
        return <p>Carregando categorias...</p>;
    }

    return (
        <div className="categories-container">
            <h2>Gerenciar Categorias</h2>

            <form onSubmit={handleSubmit} className="category-form">
                <h3>{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h3>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da categoria"
                />
                <button type="submit">{editingCategory ? 'Atualizar' : 'Adicionar'}</button>
                {editingCategory && (
                    <button type="button" onClick={resetForm} className="cancel-btn">
                        Cancelar Edição
                    </button>
                )}
                {error && <p className="error-message">{error}</p>}
            </form>

            <h3>Categorias Existentes</h3>
            <ul className="categories-list">
                {categories.map((category) => (
                    <li key={category.id}>
                        <span>{category.name}</span>
                        <div className="btn-group">
                            <button onClick={() => handleEdit(category)}>Editar</button>
                            <button onClick={() => handleDelete(category.id)} className="delete-btn">Deletar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;