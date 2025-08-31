// src/components/DashboardNavbar/DashboardNavbar.jsx
import { FaRegQuestionCircle, FaMoon, FaUserCircle } from "react-icons/fa";
import logo from "../../assets/logo.png";
import "./DashboardNavbar.css";

export default function DashboardNavbar({ onAddClick, onProfileClick, user }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo"><img src={logo} alt="TaskFlux Logo" /></div>
        <span className="logo-text">TaskFlux</span>
      </div>

      <div className="navbar-right">
        <button className="task" onClick={onAddClick}>Add New Task</button>

        <button className="icon-btn" title="Help" aria-label="Help">
          <FaRegQuestionCircle size={18} />
        </button>
        <button className="icon-btn" title="Theme" aria-label="Toggle theme">
          <FaMoon size={18} />
        </button>

        <button
          className="icon-btn"
          title={user?.name ? `Profile: ${user.name}` : "User profile"}
          aria-label="User profile"
          onClick={onProfileClick}
        >
          <FaUserCircle size={18} />
        </button>
      </div>
    </header>
  );
}
