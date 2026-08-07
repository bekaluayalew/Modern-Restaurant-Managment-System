import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, getCartTotal } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    customerName: user?.username || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    specialInstructions: '',
    paymentMethod: 'Cash'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const total = getCartTotal();
  const tax = total * 0.10;
  const grandTotal = total + tax;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
     const orderData = {
        ...formData,
        userId: isAuthenticated ? user?._id : undefined,
        items: cartItems.map(item => ({
          productId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        totalAmount: grandTotal,
        paymentStatus: 'Pending'
      };

      const response = await orderService.createOrder(orderData);
      
      if (response.success) {
        clearCart();
        navigate('/order-confirmation', { state: { order: response.order } });
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/menu');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-container">
          <h1>Checkout</h1>
          
          <div className="checkout-grid">
            <div className="checkout-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="customerName">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    className={errors.customerName ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.customerName && (
                    <span className="error-message">{errors.customerName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">Email Address *</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    className={errors.customerEmail ? 'error' : ''}
                    placeholder="Enter your email"
                  />
                  {errors.customerEmail && (
                    <span className="error-message">{errors.customerEmail}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="customerPhone">Phone Number *</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className={errors.customerPhone ? 'error' : ''}
                    placeholder="Enter your phone number"
                  />
                  {errors.customerPhone && (
                    <span className="error-message">{errors.customerPhone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="specialInstructions">Special Instructions</label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special requests or instructions..."
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash"
                        checked={formData.paymentMethod === 'Cash'}
                        onChange={handleChange}
                      />
                      <span>Cash</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Card"
                        checked={formData.paymentMethod === 'Card'}
                        onChange={handleChange}
                      />
                      <span>Card</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={formData.paymentMethod === 'Online'}
                        onChange={handleChange}
                      />
                      <span>Online</span>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="place-order-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="summary-item">
                    <span className="item-name">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;