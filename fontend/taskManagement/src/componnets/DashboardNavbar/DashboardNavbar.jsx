import { useState } from "react";
import { FaRegQuestionCircle, FaMoon, FaUserCircle } from "react-icons/fa";
import TaskModal from "../TaskModel/TaskModel";

import logo from "../../assets/logo.png";
import './DashboardNavbar.css';

export default function DashboardNavbar({ onAddTask }) {
  const [showNew, setShowNew] = useState(false);

  function handleCreateTask(newTask) {
    onAddTask(newTask); // Call the onAddTask function passed from Dashboard
    setShowNew(false); // Close the modal after creating a task
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <img src={logo} alt="TaskFlux Logo" />
        </div>
        <span className="logo-text">TaskFlux</span>
      </div>

      <div className="navbar-right">
        <button
          className="task-button"
          onClick={() => setShowNew(true)}
        >
          Add New Task
        </button>

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

      {/* Modal for adding a new task */}
      <TaskModal
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreate={handleCreateTask}
      />
    </header>
  );
}