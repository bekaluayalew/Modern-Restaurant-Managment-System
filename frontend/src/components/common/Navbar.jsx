import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCoffee, FaShoppingCart, FaUser, FaBars, FaTimes, FaUtensils} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <FaUtensils className="logo-icon" />
          <span className="logo-text">MRMS</span>
        </Link>

        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Menu
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <li>
                    <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li>
                  <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMobileMenuOpen(false)}>
                    <FaShoppingCart />
                    {cartItemCount > 0 && (
                      <span className="cart-badge">{cartItemCount}</span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-link logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="nav-link register-btn" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;