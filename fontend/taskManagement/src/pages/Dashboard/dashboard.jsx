import React, { useState } from "react";
import DashboardNavbar from "../../componnets/DashboardNavbar/DashboardNavbar.jsx";
import Sidebar from "../../componnets/sidebar/sidebar.jsx";
import Taskcard from "../../componnets/TaskCard/Taskcard.jsx";
import "./dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, when: "Today", title: "Complete React Project", desc: "Finish the dashboard and task card components.", priority: "high" },
    { id: 2, when: "Tomorrow", title: "Team Meeting", desc: "Discuss project updates and next steps.", priority: "medium" },
  ]);

  function handleAddTask(newTask) {
    setTasks((prev) => [{ ...newTask, id: crypto.randomUUID?.() ?? Date.now() }, ...prev]);
  }

  return (
    <div className="dashboard">
      <div className="dashboardnavbar">
        {/* Pass the handleAddTask function to the DashboardNavbar */}
        <DashboardNavbar onAddTask={handleAddTask} />
      </div>

      <div className="dashboard-content">
        <Sidebar />
        <div className="task-area">
          <div className="task-area-head">
            <h2>All Tasks</h2>
          </div>

          <div className="tasks">
            {tasks.map((task) => (
              <Taskcard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}