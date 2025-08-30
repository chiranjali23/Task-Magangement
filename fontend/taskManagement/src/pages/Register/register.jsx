import React from 'react'
import "./register.css"
import Navbar from '../../componnets/Navbar/Navbar'
import Slidebar from '../../componnets/Slidebar/Slidebar'

export default function register() {
  return (
    <div className='login-page'>
      <Navbar/>
        <div className="page-layout">
            <Slidebar/>
            <div className="register-container">
                <form className="register-form">
                    <h2 className="register-title">Create a New Account</h2>
                    <h5 className="register-subtitle">
                        Register Now. Already have an account? 
                        <a href="/" className="login-link">Login here</a>
                    </h5>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Fullname</label>
                        <input
                            type="text"
                            id="username"
                            className="form-input"
                            placeholder="johndoe"
                            required
                        />
                    </div>
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
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

