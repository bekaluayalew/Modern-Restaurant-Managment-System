import React, { useState, useEffect } from 'react';
import { FaUsers, FaUtensils, FaClipboardList, FaDollarSign, FaSearch, FaBell } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { productService, orderService } from '../../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 1240,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated chart data to match mockup aesthetics
  const salesData = [
    { name: 'Mon', sales: 700 }, { name: 'Tue', sales: 1300 },
    { name: 'Wed', sales: 1000 }, { name: 'Thu', sales: 1600 },
    { name: 'Fri', sales: 1200 }, { name: 'Sat', sales: 1900 },
    { name: 'Sun', sales: 1500 },
  ];

  const statusData = [
    { name: 'Completed', value: 45, color: '#27AE60' },
    { name: 'Preparing', value: 25, color: '#007AFF' },
    { name: 'Pending', value: 20, color: '#FF9900' },
    { name: 'Cancelled', value: 10, color: '#FF3B30' },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        productService.getAllProducts(),
        orderService.getAllOrders()
      ]);

      const products = productsRes.products || [];
      const orders = ordersRes.orders || [];
      const revenue = orders.reduce((total, order) => total + order.totalAmount, 0);

      setStats(prev => ({
        ...prev,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue
      }));

      setRecentOrders(orders.slice(0, 5));
      setTopProducts(products.slice(0, 4));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="loader"></div></div>;

  return (
    <div className="admin-page-container">
      {/* 1. Dashboard Sub-Header with Search (Under your Main Navbar) */}
      <div className="dashboard-sub-header">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search here..." />
        </div>
        <div className="header-meta">
          <FaBell className="notif-icon" />
          <div className="admin-profile-pill">
            <img src="https://ui-avatars.com/api/?name=Admin&background=FF6B00&color=fff" alt="admin" />
            <span>Admin <small>Administrator</small></span>
          </div>
        </div>
      </div>

      <div className="dashboard-view">
        <div className="welcome-text">
          <h1>Dashboard Overview</h1>
          <p>Track and manage your restaurant performance.</p>
        </div>

        {/* 2. Stats Cards Grid */}
        <div className="stats-cards-grid">
          <div className="dash-card card-revenue">
            <div className="card-icon"><FaDollarSign /></div>
            <div className="card-content">
              <label>Total Revenue</label>
              <h2>${stats.totalRevenue.toLocaleString()}</h2>
              <span className="growth positive">↑ 15%</span>
            </div>
          </div>
          <div className="dash-card card-orders">
            <div className="card-icon"><FaClipboardList /></div>
            <div className="card-content">
              <label>Total Orders</label>
              <h2>{stats.totalOrders}</h2>
              <span className="growth positive">↑ 10%</span>
            </div>
          </div>
          <div className="dash-card card-customers">
            <div className="card-icon"><FaUsers /></div>
            <div className="card-content">
              <label>Total Customers</label>
              <h2>{stats.totalUsers}</h2>
              <span className="growth positive">↑ 12%</span>
            </div>
          </div>
          <div className="dash-card card-foods">
            <div className="card-icon"><FaUtensils /></div>
            <div className="card-content">
              <label>Total Foods</label>
              <h2>{stats.totalProducts}</h2>
              <span className="growth positive">↑ 8%</span>
            </div>
          </div>
        </div>

        {/* 3. Charts Row */}
        <div className="charts-main-grid">
          <div className="chart-box line-box">
            <div className="box-header">
              <h3>Sales Overview</h3>
              <select><option>This Week</option></select>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#FF6B00" strokeWidth={4} dot={{ r: 6, fill: "#FF6B00", strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box donut-box">
            <h3>Orders by Status</h3>
            <div className="donut-container">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={statusData} innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-text">
                <h3>{stats.totalOrders}</h3>
                <p>Orders</p>
              </div>
            </div>
            <div className="donut-legend">
              {statusData.map(item => (
                <div key={item.name} className="legend-row">
                  <div className="legend-info">
                    <span className="dot" style={{ background: item.color }}></span>
                    {item.name}
                  </div>
                  <span className="legend-val">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Bottom Data Row */}
        <div className="dashboard-bottom-grid">
          <div className="table-box">
            <h3>Recent Orders</h3>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td>#{order.orderNumber}</td>
                    <td className="customer-cell">{order.customerName}</td>
                    <td>{order.items.length} Items</td>
                    <td><span className={`pill ${order.status.toLowerCase()}`}>{order.status}</span></td>
                    <td className="price-cell">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="top-selling-box">
            <h3>Top Selling Items</h3>
            <div className="top-items-list">
              {topProducts.map(product => (
                <div className="top-product-row" key={product._id}>
                  <img src={product.image} alt="food" />
                  <div className="item-txt">
                    <h4>{product.name}</h4>
                    <p>{product.category}</p>
                  </div>
                  <span className="item-count">{Math.floor(Math.random() * 80) + 40}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;