import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { FaFilter, FaSearch, FaSort, FaTimes } from 'react-icons/fa';
import './MenuList.css';

const MenuList = ({ products, onAddToCart, loading }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const uniqueCategories = ['all', ...new Set(products.map(p => p.category))];
      setCategories(uniqueCategories);
    }
  }, [products]);

  useEffect(() => {
    if (!products) return;

    let result = [...products];

    if (filter !== 'all') {
      result = result.filter(p => p.category === filter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
  }, [products, filter, searchTerm, sortBy]);

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loader"></div>
        <p>Loading our delicious menu...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="menu-empty">
        <div className="empty-icon">🍽️</div>
        <h3>No products available</h3>
        <p>Our menu is being updated. Please check back later!</p>
      </div>
    );
  }

  return (
    <div className="menu-list">
      <div className="menu-header">
        <div className="menu-title">
          <h2>Our Menu</h2>
          <p className="menu-subtitle">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
          </p>
        </div>
        
        <div className="menu-controls">
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <FaTimes /> : <FaFilter />}
            Filters
          </button>

          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`filters-section ${showFilters ? 'active' : ''}`}>
        <div className="filter-group">
          <label>Categories</label>
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All Items' : cat}
                {cat !== 'all' && (
                  <span className="category-count">
                    {products.filter(p => p.category === cat).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <div className="sort-options">
            <button
              className={`sort-btn ${sortBy === 'default' ? 'active' : ''}`}
              onClick={() => setSortBy('default')}
            >
              <FaSort /> Latest
            </button>
            <button
              className={`sort-btn ${sortBy === 'price-asc' ? 'active' : ''}`}
              onClick={() => setSortBy('price-asc')}
            >
              Price: Low → High
            </button>
            <button
              className={`sort-btn ${sortBy === 'price-desc' ? 'active' : ''}`}
              onClick={() => setSortBy('price-desc')}
            >
              Price: High → Low
            </button>
            <button
              className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
              onClick={() => setSortBy('name')}
            >
              Name A → Z
            </button>
          </div>
        </div>

        {(filter !== 'all' || searchTerm || sortBy !== 'default') && (
          <div className="active-filters">
            <span>Active Filters:</span>
            {filter !== 'all' && (
              <span className="filter-tag" onClick={() => setFilter('all')}>
                {filter} <FaTimes />
              </span>
            )}
            {searchTerm && (
              <span className="filter-tag" onClick={() => setSearchTerm('')}>
                "{searchTerm}" <FaTimes />
              </span>
            )}
            {sortBy !== 'default' && (
              <span className="filter-tag" onClick={() => setSortBy('default')}>
                {sortBy.replace('-', ' ')} <FaTimes />
              </span>
            )}
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No items found</h3>
          <p>Try adjusting your search or filters</p>
          <button 
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setFilter('all');
              setSortBy('default');
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList;