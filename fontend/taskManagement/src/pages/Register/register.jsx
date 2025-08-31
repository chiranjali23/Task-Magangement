// Updated Register.jsx with backend integration
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import Navbar from "../../componnets/Navbar/Navbar";
import Sidebar from "../../componnets/sidebar/sidebar";

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:5000/api';

export default function Register() {
  const [form, setForm] = useState({ 
    name: "", 
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

  // API function to register user
  async function registerRequest(userData) {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return data;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Client-side validation
    if (!form.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

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

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await registerRequest(form);
      
      // Store token in localStorage (optional)
      if (response.access_token) {
        localStorage.setItem('taskflux_token', response.access_token);
        localStorage.setItem('taskflux_user', JSON.stringify(response.user));
      }

      // Show success message and redirect
      alert('Registration successful! Please login to continue.');
      navigate("/login");
      
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <Navbar/>
      <div className="page-layout">
        <Sidebar/>
        <div className="register-container">
          <form className="register-form" onSubmit={handleSubmit}>
            <h2 className="register-title">Create a New Account</h2>
            <h5 className="register-subtitle">
              Register Now. Already have an account?
              <Link to="/login" className="login-link"> Login here</Link>
            </h5>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                name="name" 
                type="text" 
                className="form-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input 
                name="email" 
                type="email" 
                className="form-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                name="password" 
                type="password" 
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`register-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}