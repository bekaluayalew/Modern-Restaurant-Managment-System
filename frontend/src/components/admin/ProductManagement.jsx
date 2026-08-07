import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import './ProductManagement.css';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '',
  image: ''
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || ''
    });
    setEditingId(product._id);
    setError('');
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError('Name, description, price and category are required.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: formData.stock === '' ? 0 : Number(formData.stock)
    };

    try {
      const response = editingId
        ? await productService.updateProduct(editingId, payload)
        : await productService.createProduct(payload);

      if (response.success) {
        closeForm();
        fetchProducts();
      } else {
        setError(response.message || 'Something went wrong.');
      }
    } catch (err) {
      setError(err.message || 'Failed to save product.');
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete "${product.name}"? This can't be undone.`);
    if (!confirmed) return;

    try {
      const response = await productService.deleteProduct(product._id);
      if (response.success) {
        fetchProducts();
      } else {
        alert(response.message || 'Failed to delete product.');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <div className="product-mgmt-loading">
        <div className="loader"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="product-mgmt-container">
      <div className="product-mgmt-header">
        <h2>Product Management</h2>
        <button className="add-product-btn" onClick={openAddForm}>
          <FaPlus /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="product-form-modal" onClick={closeForm}>
          <div className="product-form-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeForm}>×</button>
            <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>

            {error && <p className="form-error">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Cappuccino"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description shown on the menu"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Beverage, Food, Dessert"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Image filename</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="e.g. cappuccino.jpg"
                />
                <small>Matches a file in frontend/public/images/</small>
              </div>

              <button type="submit" className="save-product-btn">
                {editingId ? 'Save Changes' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="no-products-message">
          <p>No products yet. Add your first one.</p>
        </div>
      ) : (
        <div className="product-mgmt-grid">
          {products.map((product) => (
            <div key={product._id} className="product-mgmt-card">
              <img
                src={product.image ? `/images/${product.image}` : '/favicon.svg'}
                alt={product.name}
                onError={(e) => { e.target.src = '/favicon.svg'; }}
              />
              <div className="product-mgmt-info">
                <h4>{product.name}</h4>
                <p className="product-mgmt-category">{product.category}</p>
                <p className="product-mgmt-price">${product.price.toFixed(2)}</p>
                <p className="product-mgmt-stock">Stock: {product.stock}</p>
              </div>
              <div className="product-mgmt-actions">
                <button onClick={() => openEditForm(product)} title="Edit">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(product)} title="Delete" className="delete-btn">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;