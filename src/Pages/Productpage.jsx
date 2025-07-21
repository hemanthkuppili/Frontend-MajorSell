import React, { useEffect, useState } from 'react';
import config from '../config';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get token if available
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    fetch(`${config.baseUrl}/api/products`, {
      method: 'GET',
      headers: headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError('Invalid data format received');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error connecting to server');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <h2>Products</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', width: '200px', borderRadius: '4px' }}>
                <h3>{product.name}</h3>
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
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
