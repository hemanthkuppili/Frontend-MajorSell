import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import config from '../config';
import './Searchpage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/products`);
        if (response.ok) {
          const products = await response.json();
          if (Array.isArray(products)) {
            const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
            setCategories(uniqueCategories);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Auto-search if category param is in URL
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
      performSearch('', urlCategory);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, searchCategory) => {
    setLoading(true);
    setError('');
    setResults([]);
    setHasSearched(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let url = `${config.API_BASE_URL}/products`;

      if (searchCategory) {
        url = `${config.API_BASE_URL}/products/search/category?category=${encodeURIComponent(searchCategory)}`;
      }

      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      if (Array.isArray(data)) {
        if (searchQuery) {
          const filtered = data.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setResults(filtered);
        } else {
          setResults(data);
        }
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(query, category);
  };

  return (
    <div className="search-page">
      <div className="search-page__header">
        <h1 className="search-page__title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          Search Products
        </h1>
        <p className="search-page__subtitle">Find exactly what you're looking for</p>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-bar__input-wrap">
          <svg className="search-bar__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name..."
            className="search-bar__input"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-bar__select"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="search-bar__btn">
          Search
        </button>
      </form>

      {loading && (
        <div className="search-loading">
          <span className="auth-spinner" style={{ width: '28px', height: '28px', borderWidth: '3px' }}></span>
          <p>Searching...</p>
        </div>
      )}

      {error && (
        <div className="products-alert" style={{ maxWidth: '600px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      {!loading && hasSearched && (
        <p className="search-results-count">
          {results.length} {results.length === 1 ? 'result' : 'results'} found
          {category ? ` in "${category}"` : ''}
          {query ? ` for "${query}"` : ''}
        </p>
      )}

      <div className="products-grid">
        {results.length > 0 ? (
          results.map((product, i) => (
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
              </div>
              <div className="product-card__body">
                <h3 className="product-card__title">{product.name}</h3>
                <div className="product-card__footer">
                  <span className="product-card__price">₹{product.price?.toLocaleString()}</span>
                  <button
                    className="product-card__cart-btn"
                    onClick={() => alert(`Product "${product.name}" added to cart!`)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && hasSearched && (
            <div className="products-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <h3>No Products Found</h3>
              <p>Try a different search term or category.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SearchPage;