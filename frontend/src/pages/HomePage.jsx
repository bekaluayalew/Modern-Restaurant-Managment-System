import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">Modern Restaurant</span>
            </h1>
            <p className="hero-description">
              Savor the art of fine dining.Where every plate tells a story.
              Exceptional flavors,timeless moments.Crafted for the modern plate.
            </p>
            <div className="hero-buttons">
              <Link to="/menu" className="btn btn-primary hero-btn">
                Browse Menu
              </Link>
              <Link to="/about" className="btn btn-secondary hero-btn">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Premium Quality</h3>
              <p>Carefully selected beans for the perfect cup</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fast Service</h3>
              <p>Quick ordering and efficient delivery</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Sustainable</h3>
              <p>Ethically sourced and environmentally conscious</p>
            </div>
          </div>
        </div>
      </section>

      <section className="special-section">
        <div className="container">
          <h2 className="section-title">Today's Specials</h2>
          <div className="special-grid">
            <div className="special-card">
              <div className="special-image">☕</div>
              <h3>Caramel Macchiato</h3>
              <p>Rich espresso with caramel and vanilla</p>
              <span className="special-price">$4.99</span>
            </div>
            <div className="special-card">
              <div className="special-image">🍰</div>
              <h3>Cheesecake</h3>
              <p>Creamy New York style cheesecake</p>
              <span className="special-price">$5.50</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
