import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import config from '../config';
import './Homepage.css';

const Homepage = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${config.API_BASE_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setFeaturedProducts(data.slice(0, 6));
          }
        }
      } catch (err) {
        console.error('Failed to load featured products');
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Electronics', icon: '⚡', color: '#6366f1' },
    { name: 'Fashion', icon: '👗', color: '#ec4899' },
    { name: 'Vehicles', icon: '🚗', color: '#f59e0b' },
    { name: 'Furniture', icon: '🛋️', color: '#10b981' },
    { name: 'Books', icon: '📚', color: '#3b82f6' },
    { name: 'Sports', icon: '⚽', color: '#ef4444' },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg-effects">
          <div className="hero__orb hero__orb--1"></div>
          <div className="hero__orb hero__orb--2"></div>
          <div className="hero__orb hero__orb--3"></div>
        </div>
        <div className="hero__content">
          <div className="hero__badge">🔥 Your Premium Marketplace</div>
          <h1 className="hero__title">
            Buy & Sell
            <span className="hero__title-accent"> Anything</span>
            <br />With Confidence
          </h1>
          <p className="hero__subtitle">
            Discover amazing deals on electronics, fashion, vehicles, and more.
            Join thousands of users on MajorSell — the modern way to trade.
          </p>
          <div className="hero__actions">
            <Link to="/products" className="hero__btn hero__btn--primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              Explore Products
            </Link>
            {!user && (
              <Link to="/signup" className="hero__btn hero__btn--outline">
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            )}
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-number">1K+</span>
              <span className="hero__stat-label">Products Listed</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">500+</span>
              <span className="hero__stat-label">Active Users</span>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <span className="hero__stat-number">99%</span>
              <span className="hero__stat-label">Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Browse Categories</h2>
          <p className="home-section__subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              key={i}
              className="category-card"
              style={{ '--cat-color': cat.color }}
            >
              <div className="category-card__icon">{cat.icon}</div>
              <span className="category-card__name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-section">
        <div className="home-section__header">
          <h2 className="home-section__title">Featured Products</h2>
          <Link to="/products" className="home-section__see-all">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </Link>
        </div>
        <div className="featured-grid">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="product-skeleton">
                <div className="skeleton" style={{ height: '200px' }}></div>
                <div style={{ padding: '1rem' }}>
                  <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '0.5rem' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '40%' }}></div>
                </div>
              </div>
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product, i) => (
              <div key={product._id} className="featured-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="featured-card__image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="featured-card__no-image">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                  )}
                  {product.category && (
                    <span className="featured-card__category">{product.category}</span>
                  )}
                </div>
                <div className="featured-card__body">
                  <h3 className="featured-card__title">{product.name}</h3>
                  <div className="featured-card__footer">
                    <span className="featured-card__price">₹{product.price?.toLocaleString()}</span>
                    <span className={`featured-card__status ${product.availability ? 'featured-card__status--available' : 'featured-card__status--sold'}`}>
                      {product.availability ? 'Available' : 'Sold'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="home-empty">
              <p>No products yet. Be the first to list one!</p>
              <Link to="/profile" className="hero__btn hero__btn--primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
                Start Selling
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-section__inner">
          <h2 className="cta-section__title">Ready to Start Selling?</h2>
          <p className="cta-section__text">
            List your products in minutes and reach thousands of potential buyers.
          </p>
          <Link to={user ? '/profile' : '/signup'} className="hero__btn hero__btn--primary">
            {user ? 'Go to Dashboard' : 'Create Free Account'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
