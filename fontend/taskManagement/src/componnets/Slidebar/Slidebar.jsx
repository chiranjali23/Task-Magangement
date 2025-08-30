// Sidebar.jsx
import React from 'react';
import { FaThLarge, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";
import './slidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        
        <div className="sidebar-icons">
          <button className="sidebar-btn active" title="All Tasks">
            <FaThLarge size={18} />
          </button>
          
          <button className="sidebar-btn" title="compeleted">
            <FaCheckCircle size={18} />
          </button>
          
          <button className="sidebar-btn" title="Pending Tasks">
            <FaClock size={18} />
          </button>
          
          <button className="sidebar-btn" title="Overdue">
            <FaExclamationTriangle size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}