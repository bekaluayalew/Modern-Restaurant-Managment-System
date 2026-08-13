import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCoffee, FaUtensils } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container container">
        <div className="footer-section brand-section">
          <div className="footer-logo">
            <FaUtensils className="footer-logo-icon" />
            <span>Tasty</span>
          </div>
          <p className="footer-description">
             Savor the art of fine dining.Where every plate tells a story.
              Exceptional flavors,timeless moments.Crafted for the modern plate.
            Serving the finest dining since 2022.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/returns">Returns Policy</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <ul className="contact-info">
            <li>
              <span className="contact-icon">📍</span>
              <span>Kazanchis Street, Addis Ababa, 10001</span>
            </li>
            <li>
              <span className="contact-icon">📞</span>
              <span>+1 (555) 123-4567</span>
            </li>
            <li>
              <span className="contact-icon">✉️</span>
              <span>info@mrms.com</span>
            </li>
            <li>
              <span className="contact-icon">🕐</span>
              <span>Mon-Sat: 7:00 AM - 10:00 PM</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; {2018} Modern Restaurant Management System. All rights reserved.</p>
            <p>Developed by ICON TECH Interns</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;