import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data);
            } catch (err) {
                setError('Erro ao carregar as categorias.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const resetForm = () => {
        setName('');
        setEditingCategory(null);
        setError('');
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setName(category.name);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
            try {
                await api.delete(`/categories/${id}`);
                setCategories(categories.filter(cat => cat.id !== id));
            } catch (err) {
                setError('Erro ao deletar a categoria.');
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("O nome da categoria é obrigatório.");
            return;
        }
        const categoryData = { name };
        try {
            if (editingCategory) {
                const response = await api.put(`/categories/${editingCategory.id}`, categoryData);
                setCategories(categories.map(cat => (cat.id === editingCategory.id ? response.data : cat)));
            } else {
                const response = await api.post('/categories', categoryData);
                setCategories([...categories, response.data]);
            }
            resetForm();
        } catch (err) {
            setError("Ocorreu um erro ao salvar a categoria.");
            console.error(err);
        }
    };

    if (loading) return <p className="page-container">Carregando categorias...</p>;

    return (
        <div className="page-container">
            <h1 className="page-header">Gerenciar Categorias</h1>

            {/* Formulário dentro de um card */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <form onSubmit={handleSubmit}>
                    <h3>{editingCategory ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</h3>
                    <div className="form-group">
                        <label htmlFor="categoryName">Nome da categoria</label>
                        <input
                            type="text"
                            id="categoryName"
                            className="form-control" // <--- Classe para estilizar o input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Bebidas, Lanches, etc."
                        />
                    </div>
                     {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">
                            {editingCategory ? 'Atualizar' : 'Adicionar'}
                        </button>
                        {editingCategory && (
                            <button type="button" onClick={resetForm} className="btn btn-secondary">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Lista de categorias dentro de outro card */}
            <div className="card">
                 <h3>Categorias Existentes</h3>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <div key={category.id} className="list-group-item"> {/* <--- Classe para cada item da lista */}
                            <span>{category.name}</span>
                            <div className="btn-group">
                                <button onClick={() => handleEdit(category)} className="btn btn-secondary">Editar</button>
                                <button onClick={() => handleDelete(category.id)} className="btn btn-danger">Deletar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Nenhuma categoria encontrada.</p>
                )}
            </div>
        </div>
    );
};

export default Categories;