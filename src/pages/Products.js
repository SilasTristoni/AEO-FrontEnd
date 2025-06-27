import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = { name, price: parseFloat(price), categoryId: parseInt(categoryId) };
    
    try {
        if (editingProduct) {
            await api.put(`/products/${editingProduct.id}`, productData);
        } else {
            await api.post('/products', productData);
        }
        resetForm();
        fetchProducts();
    } catch (error) {
        console.error("Failed to save product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setCategoryId(product.categoryId);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setCategoryId('');
    setEditingProduct(null);
  };

  return (
    <div>
      <h2>Products</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <input type="number" placeholder="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required />
        <button type="submit">{editingProduct ? 'Update' : 'Add'}</button>
        {editingProduct && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

      <div className="item-list">
        {products.map(product => (
          <div key={product.id} className="item-card">
            <h4>{product.name}</h4>
            <p>Price: ${product.price}</p>
            <p>Category ID: {product.categoryId}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;