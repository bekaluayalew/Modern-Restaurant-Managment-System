import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ShoppingCart from '../components/customer/ShoppingCart';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useContext(CartContext);

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page-header">
          <h1>Shopping Cart</h1>
        </div>
        
        <ShoppingCart 
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      </div>
    </div>
  );
};

export default CartPage;