import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import Navbar from "../../componnets/Navbar/Navbar";
import Sidebar from "../../componnets/sidebar/sidebar";


export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e){ setForm(p=>({...p,[e.target.name]:e.target.value})); }

  async function handleSubmit(e){
    e.preventDefault();
    try {
      await registerRequest(form);
      navigate("/login");
    } catch {
      setError("Register failed");
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
            {error && <div className="alert">{error}</div>}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input name="name" type="text" className="form-input" onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input name="email" type="email" className="form-input" onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-input" onChange={handleChange}/>
            </div>
            <button type="submit" className="register-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}
