import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css";
import Navbar from '../../componnets/Navbar/Navbar';
import Sidebar from '../../componnets/sidebar/sidebar';

export default function Login() {
  // State variables
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to handle input change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginRequest(form); // Replace with your API call
      localStorage.setItem("token", res.token); 
      navigate("/dashboard"); // 
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
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
              Login Now. Don't have an account?{" "}
              <Link to="/register" className="register-link">Register here</Link>
            </h5>

            {error && <p className="error-message">{error}</p>}

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
                required
              />
            </div>

            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}