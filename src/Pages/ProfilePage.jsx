import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Instead of redirecting, show a message if not logged in
    if (!token) {
      setProfile(null);
      setError('Please log in to view your profile');
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Uncomment this when the profile endpoint is available
        /*
        const response = await fetch(`${config.API_BASE_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            setError('Session expired. Please log in again');
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
        */

        // Temporary solution until profile endpoint is available
        setProfile({
          name: 'User',
          email: 'user@example.com',
        });
      } catch (err) {
        setError(err.message || 'Error fetching profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setProfile(null);
    setError('You have been logged out');
  };

  if (loading) {
    return <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {profile ? (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Name:</strong> {profile.name}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong> {profile.email}
          </div>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <p>You need to be logged in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
