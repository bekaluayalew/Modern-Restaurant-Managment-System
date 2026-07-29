import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaStar, FaStarHalf, FaPlus, FaMinus } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const getStockStatus = (stock) => {
    if (stock > 10) return { text: 'In Stock', color: '#27ae60', icon: '✅' };
    if (stock > 0) return { text: 'Low Stock', color: '#f39c12', icon: '⚠️' };
    return { text: 'Out of Stock', color: '#e74c3c', icon: '❌' };
  };

  const stockStatus = getStockStatus(product.stock);
  const rating = product.rating || 4.5;
  const reviews = product.reviews || 12;

  const renderRating = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="star filled" />);
      } else {
        stars.push(<FaStar key={i} className="star" />);
      }
    }
    return stars;
  };

  return (
    <div 
      className={`product-card ${isHovered ? 'hovered' : ''} ${stockStatus.text === 'Out of Stock' ? 'out-of-stock' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <img 
          src={`/images/${product.image}` || '/images/default-product.jpg'} 
          alt={product.name}
          className="product-image"
        />
        <div className="product-badge" style={{ backgroundColor: stockStatus.color }}>
          {stockStatus.icon} {stockStatus.text}
        </div>
        
        <button 
          className={`wishlist-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="Add to wishlist"
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
        
        {isHovered && (
          <div className="quick-view-overlay">
            <button className="quick-view-btn">Quick View</button>
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-price">${product.price.toFixed(2)}</span>
        </div>
        
        <p className="product-description">{product.description}</p>
        
        <div className="product-meta">
          <div className="product-category">
            <span className="category-tag">{product.category}</span>
          </div>
          <div className="product-rating">
            {renderRating()}
            <span className="review-count">({reviews})</span>
          </div>
        </div>
        
        <div className="product-actions">
          <div className="quantity-control">
            <button 
              className="qty-btn"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={stockStatus.text === 'Out of Stock'}
            >
              <FaMinus />
            </button>
            <span className="qty-display">{quantity}</span>
            <button 
              className="qty-btn"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={stockStatus.text === 'Out of Stock'}
            >
              <FaPlus />
            </button>
          </div>
          
          <button 
            className={`add-to-cart-btn ${stockStatus.text === 'Out of Stock' ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={stockStatus.text === 'Out of Stock'}
          >
            {stockStatus.text === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;