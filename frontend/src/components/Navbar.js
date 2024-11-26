import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Logo and Home link */}
        <Link to="/" className="navbar-item">
          SecureQR Vault
        </Link>
      </div>

      <div className="navbar-links">
        {/* Navigation links */}
        <Link to="/" className="navbar-item">
          Home
        </Link>
        <Link to="/login" className="navbar-item">
          Login
        </Link>
        <Link to="/register" className="navbar-item">
          Register
        </Link>
        <Link to="/generate-keys" className="navbar-item">
          Encrypt Data
        </Link>
        <Link to="/uploaddecrypt" className="navbar-item">
          Decrypt Data
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
