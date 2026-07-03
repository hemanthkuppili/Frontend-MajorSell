import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from '../Pages/Homepage';
import Loginpage from '../Pages/Loginpage';
import Signuppage from '../Pages/Signuppage';
import ProfilePage from '../Pages/ProfilePage';
import ProductPage from '../Pages/Productpage';
import SearchPage from '../Pages/Searchpage';
import ProductCreationpage from '../Pages/ProductCreationpage';
import Navbar from '../components/Navbar';

const AppRoute = () => (
  <Router>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/create-product" element={<ProductCreationpage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </main>
  </Router>
);

export default AppRoute;