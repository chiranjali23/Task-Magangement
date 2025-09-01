import React, { useMemo, useState } from "react";

// keep your existing imports
import DashboardNavbar from "../../componnets/DashboardNavbar/DashboardNavbar.jsx";
import Sidebar from "../../componnets/sidebar/sidebar.jsx";
import TaskCard from "../../componnets/TaskCard/Taskcard.jsx";
import TaskModal from "../../componnets/TaskModel/TaskModel.jsx";
import ProfileModal from "../../componnets/Profile/profile.jsx";
import Rightbar from "../../componnets/Rightbar/Rightbar.jsx";

import "./dashboard.css";

export default function Dashboard() {
  // ---- user (mock) ----
  const [user, setUser] = useState({
    id: 1,
    name: "William Slatter",
    email: "william@example.com",
  });

  // ---- tasks (mock data) ----
  const [tasks, setTasks] = useState([
    {
      id: 1,
      when: "2025-08-31",
      title: "Complete React Project",
      desc: "Finish the dashboard and task card components.",
      priority: "high",
      completed: false,
      deleted: false, // New property to track deleted tasks
    },
    {
      id: 2,
      when: "2025-09-01",
      title: "Team Meeting",
      desc: "Discuss project updates and next steps.",
      priority: "medium",
      completed: false,
      deleted: false,
    },
    {
      id: 3,
      when: "2025-08-15",
      title: "Old ticket clean-up",
      desc: "Close or move stale issues.",
      priority: "low",
      completed: true,
      deleted: false,
    },
  ]);

  // ---- UI state ----
  const [filter, setFilter] = useState("all"); // "all" | "completed" | "pending" | "overdue" | "deleted"
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" | "edit"
  const [editingTask, setEditingTask] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // ---- Modal open helpers ----
  function openCreate() {
    setModalMode("create");
    setEditingTask(null);
    setModalOpen(true);
  }
  function openEdit(task) {
    setModalMode("edit");
    setEditingTask(task);
    setModalOpen(true);
  }

  // ---- CRUD handlers ----
  function handleCreateTask(payload) {
    const newTask = {
      id: crypto.randomUUID?.() ?? Date.now(),
      completed: false,
      deleted: false, // Ensure new tasks are not marked as deleted
      ...payload,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function handleUpdateTask(id, payload) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...payload } : t)));
  }

  function handleDeleteTask(id) {
    // Mark the task as deleted instead of removing it
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, deleted: true } : t)));
  }

  function handleToggleComplete(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  // ---- Profile handlers (stub for now) ----
  async function saveProfile({ name, email }) {
    setUser((p) => ({ ...p, name, email }));
  }
  async function changePassword() {
    return;
  }

  // ---- Filtering ----
  const filteredTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      if (filter === "all") return !t.deleted; // Show all non-deleted tasks
      if (filter === "completed") return t.completed && !t.deleted;
      if (filter === "pending") return !t.completed && !t.deleted;
      if (filter === "overdue") {
        const due = new Date(t.when);
        return !t.completed && due < now && !t.deleted;
      }
      if (filter === "deleted") return t.deleted; // Show only deleted tasks
      return true;
    });
  }, [tasks, filter]);

  // ---- Stats for right bar ----
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.completed && !t.deleted).length;
    const open = tasks.filter((t) => !t.completed && !t.deleted).length;
    return {
      total: tasks.filter((t) => !t.deleted).length,
      inProgress: open, // simple model; customize if you track "in progress"
      open,
      completed,
    };
  }, [tasks]);

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
    
        <Sidebar onFilterChange={setFilter} />

        
        <div className="task-area">
          <div className="task-area-head">
            <h2>
              {filter === "all"
                ? "All Tasks"
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </h2>
          </div>

          <div className="tasks">
            {filteredTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                onEdit={openEdit}
                onDelete={handleDeleteTask}
                onToggleComplete={handleToggleComplete} // star/complete toggle
              />
            ))}
          </div>
        </div>

        {/* right slide bar */}
        <div className="right-panel">
          <Rightbar
            user={{ name: user.name }}
            stats={stats}
            completion={stats.completed}
          />
        </div>
      </div>

      {/* Modals */}
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