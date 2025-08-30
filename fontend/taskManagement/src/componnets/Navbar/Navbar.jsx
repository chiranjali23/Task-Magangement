// Navbar.jsx
import { Link } from "react-router-dom";
import { FaRegQuestionCircle, FaMoon, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";
import logo from "../../assets/logo.png";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img src={logo} alt="TaskFlux Logo" />
        </div>
        <span className="logo-text">TaskFlux</span>
      </div>
       
      <div className="navbar-right">
        <div className="login-btn">
          <Link to="/login" className="login">Login</Link>
          <span className="separator"> / </span>
          <Link to="/register" className="register">Register</Link>
        </div>
         
        <button className="icon-btn" title="Help" aria-label="Help">
          <FaRegQuestionCircle size={18} />
        </button>
         
        <button className="icon-btn" title="Theme" aria-label="Toggle theme">
          <FaMoon size={18} />
        </button>
         
        <button className="icon-btn" title="Profile" aria-label="User profile">
          <FaUserCircle size={18} />
        </button>
      </div>
    </header>
  );
}