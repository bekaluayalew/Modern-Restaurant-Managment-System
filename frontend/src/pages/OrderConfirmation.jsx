import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="container">
          <div className="confirmation-card">
            <h2>No order found</h2>
            <Link to="/menu" className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            <FaCheckCircle />
          </div>
          
          <h2>Order Placed Successfully!</h2>
          <p className="order-number">Order #{order.orderNumber}</p>
          
          <div className="order-details">
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total:</span>
              <span className="detail-value">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Customer:</span>
              <span className="detail-value">{order.customerName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment:</span>
              <span className="detail-value">{order.paymentMethod}</span>
            </div>
          </div>

          <div className="order-items">
            <h3>Order Items</h3>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <span className="item-name">
                  {item.quantity}× {item.productName}
                </span>
                <span className="item-price">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="confirmation-actions">
            <Link to="/menu" className="btn btn-primary">
              Continue Shopping
            </Link>
            <Link to="/" className="btn btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
