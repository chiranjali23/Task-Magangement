// Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "./login.css";
import Navbar from '../../componnets/Navbar/Navbar';
import Sidebar from '../../componnets/Slidebar/Slidebar';

export default function Login() {
  return (
    <div className="login-page">
      <Navbar />
      <div className="page-layout">
        <Sidebar />
        <div className="login-container">
          <form className="login-form">

            <h2 className="login-title">Login to Your Account</h2>
            <h5 className="login-subtitle">
              Login Now. Don't have an account? 
              <Link to="/register" className="register-link">Register here</Link>
            </h5>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                className="form-input" 
                placeholder="johndoe@gmail.com" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-input" 
                placeholder="••••••••••••" 
                required 
              />
            </div>
            
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
            
            <button type="submit" className="login-button">
              Login 
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}