import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import config from '../config';
import './ProductCreationpage.css';

const ProductCreationpage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    description: '',
    availability: true,
    image: null,
  });

  const categories = ['Electronics', 'Fashion', 'Vehicles', 'Furniture', 'Books', 'Sports', 'Other'];

  if (!user) {
    return (
      <div className="product-creation__not-logged">
        <h2>Please log in to create a product</h2>
        <p>You need to be logged in to list products for sale.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('price', formData.price);
      data.append('availability', formData.availability);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        alert('Product created successfully!');
        navigate('/products');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create product'}`);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-creation">
      <div className="product-creation__container">
        <div className="product-creation__header">
          <h1>Create New Product</h1>
          <p>List your item for sale on MajorSell</p>
        </div>

        <form onSubmit={handleSubmit} className="product-creation__form">
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., iPhone 15 Pro"
              required
              className="form-input"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="form-input"
            />
          </div>

          {/* Availability */}
          <div className="form-group form-group--checkbox">
            <label htmlFor="availability" className="checkbox-label">
              <input
                id="availability"
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span>Available for sale</span>
            </label>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <div className="image-upload">
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="image-input"
              />
              <div className="image-upload__label">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <p>Click to upload or drag and drop</p>
                <span>PNG, JPG, GIF up to 10MB</span>
              </div>
            </div>

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setFormData(prev => ({ ...prev, image: null }));
                  }}
                  className="image-preview__remove"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn--primary"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="btn btn--outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreationpage;
