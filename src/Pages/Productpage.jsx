import React, { useEffect, useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import config from '../config';
import './Productpage.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${config.API_BASE_URL}/products`, {
          method: 'GET',
          headers,
        });

        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        setError(err.message || 'Error connecting to server');
      }
      setLoading(false);
    };

    fetchProducts();
  }, [token]);

  return (
    <div className="products-page">
      <div className="products-page__header">
        <div>
          <h1 className="products-page__title">All Products</h1>
          <p className="products-page__subtitle">
            Discover {products.length > 0 ? `${products.length} items` : 'amazing deals'} on the marketplace
          </p>
        </div>
      </div>

      {error && (
        <div className="products-alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="product-card product-card--skeleton">
              <div className="skeleton" style={{ height: '220px' }}></div>
              <div style={{ padding: '1.25rem' }}>
                <div className="skeleton" style={{ height: '18px', width: '75%', marginBottom: '0.75rem' }}></div>
                <div className="skeleton" style={{ height: '14px', width: '50%', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ height: '32px', width: '40%' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product, i) => (
              <div
                className="product-card animate-fade-in-up"
                key={product._id}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="product-card__image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="product-card__no-image">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                  )}
                  {product.category && (
                    <span className="product-card__badge">{product.category}</span>
                  )}
                  <span className={`product-card__availability ${product.availability ? '' : 'product-card__availability--sold'}`}>
                    {product.availability ? '● Available' : '● Sold'}
                  </span>
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{product.name}</h3>
                  {product.postedBy && (
                    <p className="product-card__seller">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      {product.postedBy.name || 'Seller'}
                    </p>
                  )}
                  {product.createdAt && (
                    <p className="product-card__date">
                      {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                  <div className="product-card__footer">
                    <span className="product-card__price">₹{product.price?.toLocaleString()}</span>
                    <div className="product-card__actions">
                      <button
                        className="product-card__view-btn"
                        onClick={() => alert(`Viewing: ${product.name}`)}
                        title="View Details"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      </button>
                      <button
                        className="product-card__cart-btn"
                        onClick={() => alert(`Product "${product.name}" added to cart!`)}
                        title="Add to Cart"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="products-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
              <h3>No Products Yet</h3>
              <p>Be the first to list a product on the marketplace!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
