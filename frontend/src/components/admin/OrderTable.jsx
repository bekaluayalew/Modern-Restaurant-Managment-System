import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/api';
import { FaSync, FaEye } from 'react-icons/fa';
import './OrderTable.css';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      if (response.success) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const statusOptions = ['Pending', 'Processing', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  if (loading) {
    return (
      <div className="order-table-loading">
        <div className="loader"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="order-table-container">
      <div className="order-table-header">
        <h2>Order Management</h2>
        <div className="order-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Orders</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button onClick={fetchOrders} className="refresh-btn">
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders-message">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <span className="order-number">{order.orderNumber}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="order-actions">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button 
                    className="view-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <FaEye />
                  </button>
                </div>
              </div>
              <div className="order-card-body">
                <div className="customer-info">
                  <span><strong>Customer:</strong> {order.customerName}</span>
                  <span><strong>Email:</strong> {order.customerEmail}</span>
                  <span><strong>Phone:</strong> {order.customerPhone || 'N/A'}</span>
                </div>
                <div className="order-items-summary">
                  <span><strong>Items:</strong> {order.items.length}</span>
                  <span><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</span>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="order-detail-modal" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
            <h3>Order Details - {selectedOrder.orderNumber}</h3>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerPhone || 'N/A'}</p>
                <p><strong>Instructions:</strong> {selectedOrder.specialInstructions || 'None'}</p>
              </div>
              <div className="detail-section">
                <h4>Order Items</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="detail-item">
                    <span>{item.quantity}× {item.productName}</span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
                <div className="detail-total">
                  <strong>Total:</strong> ${selectedOrder.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="detail-section">
                <h4>Payment</h4>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedOrder.paymentStatus}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;