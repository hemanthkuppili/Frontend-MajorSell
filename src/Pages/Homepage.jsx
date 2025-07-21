import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to MajorSell!</h1>
      <p>Your one-stop marketplace to buy and sell products easily.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/products" style={{ marginRight: '1rem', padding: '0.5rem 1rem', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }}>View Products</Link>
        <Link to="/profile" style={{ padding: '0.5rem 1rem', background: '#28a745', color: '#fff', textDecoration: 'none', borderRadius: '4px', display: 'inline-block' }}>My Profile</Link>
      </div>
    </div>
  );
};

export default Homepage;
