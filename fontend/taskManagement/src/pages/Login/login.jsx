// Updated Login.jsx with backend integration
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css";
import Navbar from '../../componnets/Navbar/Navbar'
import Sidebar from '../../componnets/sidebar/sidebar'

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:5000/api';

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  }

  // API function to login user
  async function loginRequest(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (!form.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!form.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const response = await loginRequest(form);
      
      // Store token and user data
      if (response.access_token) {
        localStorage.setItem('taskflux_token', response.access_token);
        localStorage.setItem('taskflux_user', JSON.stringify(response.user));
      }

      // Redirect to dashboard
      navigate("/dashboard");
      
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <Navbar />
      <div className="page-layout">
        <Sidebar />
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Login to Your Account</h2>
            <h5 className="login-subtitle">
              Login Now. Don't have an account? 
              <Link to="/register" className="register-link">Register here</Link>
            </h5>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input" 
                placeholder="johndoe@gmail.com" 
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-input" 
                placeholder="••••••••••••" 
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required 
              />
            </div>
            
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
            
            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}