import React, { useState, useEffect } from 'react';
import config from '../config';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch all products on component mount to extract unique categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/products`);
        if (response.ok) {
          const products = await response.json();
          if (Array.isArray(products)) {
            // Extract unique categories
            const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];
            setCategories(uniqueCategories);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      // Get token if available
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let url = `${config.API_BASE_URL}/products`;
      
      // If category is selected, use the category search endpoint
      if (category) {
        url = `${config.API_BASE_URL}/products/search/category?category=${encodeURIComponent(category)}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products by category');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          // If there's also a text query, filter the category results
          if (query) {
            const filteredResults = data.filter(product => 
              product.name.toLowerCase().includes(query.toLowerCase()) || 
              (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
            );
            setResults(filteredResults);
          } else {
            setResults(data);
          }
        } else {
          setError('No results found');
        }
      } else {
        // If no category selected, fetch all products and filter by query
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          // Filter products based on search query
          if (query) {
            const filteredResults = data.filter(product => 
              product.name.toLowerCase().includes(query.toLowerCase()) || 
              (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
            );
            setResults(filteredResults);
          } else {
            setResults(data);
          }
        } else {
          setError('No results found');
        }
      }
    } catch (err) {
      setError(err.message || 'Error connecting to server');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h2>Search Products</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', marginBottom: '1rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            style={{ flex: '1', padding: '0.5rem', marginRight: '1rem' }}
          />
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '0.5rem', width: '150px' }}
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          style={{ 
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Search
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {results.length > 0 ? (
          results.map((product) => (
            <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px', borderRadius: '4px' }}>
              <h3>{product.name}</h3>
              {product.category && <p><strong>Category:</strong> {product.category}</p>}
              <p>{product.description}</p>
              <p><strong>Price:</strong> ₹{product.price}</p>
              {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto' }} />}
              <button 
                style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.5rem', width: '100%', marginTop: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                onClick={() => alert(`Product ${product.name} added to cart!`)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          !loading && !error && <p>No products found. Try a different search term or category.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;