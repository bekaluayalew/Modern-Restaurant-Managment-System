
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AdminPanel from '../components/admin/AdminPanel';
import { AuthContext } from '../context/AuthContext';
import './AdminPage.css';

const AdminPage = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

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
      <AdminPanel />
    </div>
  );
};

export default AdminPage;
