import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import './ShoppingCart.css';

const ShoppingCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [total, setTotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    setTotal(newTotal);
    setItemCount(newCount);
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Browse our menu and add your favorite items!</p>
        <Link to="/menu" className="browse-menu-btn">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button className="clear-cart-btn" onClick={onClearCart}>
          <FaTrash /> Clear Cart
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="item-image">
              <img src={item.image || '/images/default-product.jpg'} alt={item.name} />
            </div>
            
            <div className="item-details">
              <h4 className="item-name">{item.name}</h4>
              <p className="item-price">${item.price.toFixed(2)}</p>
              <span className="item-category">{item.category}</span>
            </div>
            
            <div className="item-controls">
              <div className="quantity-control">
                <button 
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                >
                  <FaMinus />
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
              <button 
                className="remove-btn"
                onClick={() => onRemoveItem(item._id)}
                aria-label="Remove item"
              >
                <FaTrash />
              </button>
            </div>
            
            <div className="item-subtotal">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Items ({itemCount})</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (10%)</span>
          <span>${(total * 0.10).toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${(total * 1.10).toFixed(2)}</span>
        </div>
        
        <Link to="/checkout" className="checkout-btn">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default ShoppingCart;