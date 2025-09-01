// Sidebar.jsx
import React, { useState } from 'react';
import { FaThLarge, FaCheckCircle, FaClock, FaExclamationTriangle, FaRecycle } from "react-icons/fa";
import './sidebar.css';

export default function Sidebar({ onFilterChange }) {
  const [active, setActive] = useState("all");

  function handleClick(filter) {
    setActive(filter);
    onFilterChange(filter); // tell parent (Dashboard) which filter is chosen
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-icons">
          <button 
            className={`sidebar-btn ${active === "all" ? "active" : ""}`} 
            title="All Tasks"
            onClick={() => handleClick("all")}
          >
            <FaThLarge size={18} />
          </button>
          
          <button 
            className={`sidebar-btn ${active === "completed" ? "active" : ""}`} 
            title="Completed"
            onClick={() => handleClick("completed")}
          >
            <FaCheckCircle size={18} />
          </button>
          
          <button 
            className={`sidebar-btn ${active === "pending" ? "active" : ""}`} 
            title="Pending Tasks"
            onClick={() => handleClick("pending")}
          >
            <FaClock size={18} />
          </button>
          
          <button 
            className={`sidebar-btn ${active === "overdue" ? "active" : ""}`} 
            title="Overdue"
            onClick={() => handleClick("overdue")}
          >
            <FaExclamationTriangle size={18} />
          </button>
        </div>

        {/* Add the recycle icon */}
        <div className="sidebar-bottom">
          <button 
            className={`sidebar-btn ${active === "deleted" ? "active" : ""}`} 
            title="Deleted Tasks"
            onClick={() => handleClick("deleted")}
          >
            <FaRecycle size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}