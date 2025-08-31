// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from "react";

// keep your existing paths (componnets)
import DashboardNavbar from "../../componnets/DashboardNavbar/DashboardNavbar.jsx";
import Sidebar from "../../componnets/sidebar/sidebar.jsx";
import TaskCard from "../../componnets/TaskCard/Taskcard.jsx";
import TaskModal from "../../componnets/TaskModel/TaskModel.jsx";
import ProfileModal from "../../componnets/Profile/profile.jsx";
import RightPanel from "../../componnets/Rightbar/Rightbar.jsx";

import "./dashboard.css";

export default function Dashboard() {
  // mock user (replace with API/localStorage)
  const [user, setUser] = useState({
    id: 1,
    name: "William Slatter",
    email: "william@example.com",
  });

  // tasks
  const [tasks, setTasks] = useState([
    {
      id: 1,
      when: "2025-08-31",
      title: "Complete React Project",
      desc: "Finish the dashboard and task card components.",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      when: "2025-09-01",
      title: "Team Meeting",
      desc: "Discuss project updates and next steps.",
      priority: "medium",
      completed: false,
    },
  ]);

  // task modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingTask, setEditingTask] = useState(null);

  // profile modal
  const [profileOpen, setProfileOpen] = useState(false);

  // open create
  function openCreate() {
    setModalMode("create");
    setEditingTask(null);
    setModalOpen(true);
  }

  // open edit
  function openEdit(task) {
    setModalMode("edit");
    setEditingTask(task);
    setModalOpen(true);
  }

  // CRUD
  function handleCreateTask(payload) {
    const newTask = {
      id: crypto.randomUUID?.() ?? Date.now(),
      completed: false,
      ...payload,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleUpdateTask(id, payload) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...payload } : t)));
  }

  function handleDeleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function handleToggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  // profile actions (stub)
  async function saveProfile({ name, email }) {
    setUser((p) => ({ ...p, name, email }));
  }
  async function changePassword() {
    return;
  }

  // compute simple stats for right panel
  const stats = {
    total: tasks.length,
    inProgress: tasks.filter((t) => !t.completed).length,
    open: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  return (
    <div className="dashboard">
      <div className="dashboardnavbar">
        <DashboardNavbar
          onAddClick={openCreate}
          onProfileClick={() => setProfileOpen(true)}
          user={user}
        />
      </div>

      <div className="dashboard-content">
        <Sidebar />

        <div className="task-area">
          <div className="task-area-head">
            <h2>All Tasks</h2>
          </div>

          <div className="tasks">
            {tasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onEdit={openEdit}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        </div>

        {/* 👉 Right-side sticky info panel */}
        <RightPanel
          user={{ name: user.name }}
          stats={stats}
          completion={stats.completed}
        />
      </div>

      <TaskModal
        open={modalOpen}
        mode={modalMode}
        initialTask={editingTask}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateTask}
        onUpdate={handleUpdateTask}
      />

      <ProfileModal
        open={profileOpen}
        user={user}
        onClose={() => setProfileOpen(false)}
        onSaveProfile={saveProfile}
        onChangePassword={changePassword}
      />
    </div>
  );
}
