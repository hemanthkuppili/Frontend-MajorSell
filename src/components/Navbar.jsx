import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">◆</span>
          <span className="navbar__logo-text">Major<span className="navbar__logo-accent">Sell</span></span>
        </Link>

        <button
          className={`navbar__toggle ${mobileOpen ? 'navbar__toggle--active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar__menu ${mobileOpen ? 'navbar__menu--open' : ''}`}>
          <ul className="navbar__links">
            <li>
              <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className={`navbar__link ${isActive('/products') ? 'navbar__link--active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                Products
              </Link>
            </li>
            <li>
              <Link to="/search" className={`navbar__link ${isActive('/search') ? 'navbar__link--active' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                Search
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/create-product" className={`navbar__link ${isActive('/create-product') ? 'navbar__link--active' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Sell
                </Link>
              </li>
            )}
          </ul>

          <div className="navbar__actions">
            {user ? (
              <>
                <Link to="/profile" className="navbar__user-btn">
                  <div className="navbar__avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="navbar__username">{user.name || 'Profile'}</span>
                </Link>
                <button onClick={logout} className="navbar__btn navbar__btn--ghost">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar__btn navbar__btn--ghost">
                  Login
                </Link>
                <Link to="/signup" className="navbar__btn navbar__btn--primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;