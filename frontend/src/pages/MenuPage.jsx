import React, { useState, useEffect, useContext } from 'react';
import MenuList from '../components/customer/MenuList';
import { productService } from '../services/api';
import { CartContext } from '../context/CartContext';
import './MenuPage.css';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success) {
        setProducts(response.products);
      } else {
        setError('Failed to load products');
      }
    } catch (err) {
      setError('Error loading products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
  };

  return (
    <div className="menu-page">
      <div className="container">
        <div className="menu-page-header">
          <h1>Our Menu</h1>
          <p>Discover our delicious selection of foods,coffees, tea, and pastries</p>
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchProducts} className="btn btn-primary">
              Try Again
            </button>
          </div>
        )}
        
        <MenuList 
          products={products}
          onAddToCart={handleAddToCart}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default MenuPage;