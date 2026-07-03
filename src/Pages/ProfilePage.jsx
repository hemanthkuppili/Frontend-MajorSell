import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import config from '../config';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, token, logout } = useAuth();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSellForm, setShowSellForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', price: '', image: null });
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMyProducts();
  }, [token]);

  const fetchMyProducts = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/products/user/my`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setMyProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
    setLoading(false);
  };

  const handleSellProduct = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage({ type: '', text: '' });

    try {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('category', formData.category);
      body.append('price', formData.price);
      if (formData.image) body.append('image', formData.image);

      const res = await fetch(`${config.API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body,
      });

      const data = await res.json();

      if (res.ok) {
        setFormMessage({ type: 'success', text: 'Product listed successfully!' });
        setFormData({ name: '', category: '', price: '', image: null });
        setShowSellForm(false);
        fetchMyProducts();
      } else {
        setFormMessage({ type: 'error', text: data.message || 'Failed to create product' });
      }
    } catch (err) {
      setFormMessage({ type: 'error', text: 'Error connecting to server' });
    }
    setFormLoading(false);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`${config.API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        setMyProducts(prev => prev.filter(p => p._id !== productId));
      }
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!token && !loading) {
    return (
      <div className="profile-page">
        <div className="profile-login-prompt animate-fade-in-up">
          <div className="profile-login-prompt__icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </div>
          <h2>Sign in to View Your Profile</h2>
          <p>Access your dashboard, manage listings, and track your activity.</p>
          <div className="profile-login-prompt__actions">
            <button className="hero__btn hero__btn--primary" onClick={() => navigate('/login')}>
              Sign In
            </button>
            <button className="hero__btn hero__btn--outline" onClick={() => navigate('/signup')}>
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header animate-fade-in-up">
        <div className="profile-header__bg"></div>
        <div className="profile-header__content">
          <div className="profile-header__avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-header__info">
            <h1 className="profile-header__name">{user?.name || 'User'}</h1>
            <p className="profile-header__email">{user?.email || ''}</p>
          </div>
          <button className="profile-header__logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            Logout
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="profile-stats animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="profile-stat-card">
          <span className="profile-stat-card__number">{myProducts.length}</span>
          <span className="profile-stat-card__label">My Listings</span>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-card__number">{myProducts.filter(p => p.availability).length}</span>
          <span className="profile-stat-card__label">Active</span>
        </div>
        <div className="profile-stat-card">
          <span className="profile-stat-card__number">{myProducts.filter(p => !p.availability).length}</span>
          <span className="profile-stat-card__label">Sold</span>
        </div>
      </div>

      {/* Sell Product */}
      <div className="profile-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="profile-section__header">
          <h2>My Products</h2>
          <button
            className="profile-sell-btn"
            onClick={() => setShowSellForm(!showSellForm)}
          >
            {showSellForm ? (
              <>✕ Cancel</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Sell Product
              </>
            )}
          </button>
        </div>

        {formMessage.text && (
          <div className={`auth-alert auth-alert--${formMessage.type} animate-fade-in`}>
            {formMessage.text}
          </div>
        )}

        {showSellForm && (
          <form onSubmit={handleSellProduct} className="sell-form animate-fade-in">
            <div className="sell-form__grid">
              <div className="auth-field">
                <label className="auth-label">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                  className="auth-input"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Electronics, Fashion"
                  className="auth-input"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Enter price"
                  required
                  min="0"
                  className="auth-input"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="auth-input sell-form__file"
                  style={{ paddingLeft: '0.85rem' }}
                />
              </div>
            </div>
            <button type="submit" className="auth-submit" disabled={formLoading}>
              {formLoading ? (
                <span className="auth-submit__loading">
                  <span className="auth-spinner"></span>
                  Listing...
                </span>
              ) : (
                'List Product'
              )}
            </button>
          </form>
        )}

        {/* Products List */}
        {loading ? (
          <div className="search-loading">
            <span className="auth-spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }}></span>
            <p>Loading your products...</p>
          </div>
        ) : myProducts.length > 0 ? (
          <div className="profile-products-grid">
            {myProducts.map((product, i) => (
              <div key={product._id} className="profile-product-card animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="profile-product-card__image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="product-card__no-image">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                  )}
                </div>
                <div className="profile-product-card__body">
                  <h3>{product.name}</h3>
                  {product.category && <span className="profile-product-card__cat">{product.category}</span>}
                  <span className="product-card__price">₹{product.price?.toLocaleString()}</span>
                </div>
                <button
                  className="profile-product-card__delete"
                  onClick={() => handleDeleteProduct(product._id)}
                  title="Delete product"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="profile-empty">
            <p>You haven't listed any products yet. Start selling!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
