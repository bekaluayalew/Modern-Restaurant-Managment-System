import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminPanel from '../components/admin/AdminPanel';
import OrderTable from '../components/admin/OrderTable';
import ProductManagement from '../components/admin/ProductManagement';
import { AuthContext } from '../context/AuthContext';
import './AdminPage.css';

const AdminPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Check if user is authenticated and is admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="admin-error">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
      </div>

      {activeTab === 'dashboard' && <AdminPanel />}
      {activeTab === 'orders' && <div className="admin-tab-content"><OrderTable /></div>}
      {activeTab === 'products' && <div className="admin-tab-content"><ProductManagement /></div>}
    </div>
  );
};

export default AdminPage;