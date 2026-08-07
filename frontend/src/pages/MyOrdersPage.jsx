import React, { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (err) {
      console.error('Error fetching your orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (order) => {
    const confirmed = window.confirm(`Cancel order #${order.orderNumber}?`);
    if (!confirmed) return;

    try {
      setCancellingId(order._id);
      const response = await orderService.cancelOrder(order._id);
      if (response.success) {
        fetchOrders();
      } else {
        alert(response.message || 'Could not cancel this order.');
      }
    } catch (err) {
      alert(err.message || 'Could not cancel this order.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="my-orders-list">
            {orders.map((order) => (
              <div key={order._id} className="my-order-card">
                <div className="my-order-header">
                  <div>
                    <span className="order-number">Order #{order.orderNumber}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="my-order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="my-order-item">
                      <span>{item.quantity}× {item.productName}</span>
                      <span>${item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="my-order-footer">
                  <span className="my-order-total">Total: ${order.totalAmount.toFixed(2)}</span>
                  {order.status === 'Pending' && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancel(order)}
                      disabled={cancellingId === order._id}
                    >
                      {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;