import React, { useState } from "react";
import DashboardNavbar from "../../componnets/DashboardNavbar/DashboardNavbar.jsx";
import Sidebar from "../../componnets/sidebar/sidebar.jsx";
import Taskcard from "../../componnets/TaskCard/Taskcard.jsx";
import TaskModal from "../../componnets/TaskModel/TaskModel.jsx";
import "./dashboard.css";

export default function Dashboard() {
  const [showNew, setShowNew] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, when: "Today", title: "Complete React Project", desc: "Finish the dashboard and task card components.", priority: "high" },
    { id: 2, when: "Tomorrow", title: "Team Meeting", desc: "Discuss project updates and next steps.", priority: "medium" },
  ]);

  function handleCreateTask(newTask) {
    setTasks((prev) => [{ ...newTask, id: crypto.randomUUID?.() ?? Date.now() }, ...prev]);
    setShowNew(false); // Close the modal after adding a task
  }

  return (
    <div className="dashboard">
      <div className="dashboardnavbar">
        <DashboardNavbar onAddTaskClick={() => setShowNew(true)} />
      </div>

      <div className="dashboard-content">
        <Sidebar />
        <div className="task-area">
          <div className="task-area-head">
            <h2>All Tasks</h2>
            <button className="add-btn" onClick={() => setShowNew(true)}>
              Add a new Task
            </button>
          </div>

          <div className="tasks">
            {tasks.map((task) => (
              <Taskcard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal for adding a new task */}
      <TaskModal open={showNew} onClose={() => setShowNew(false)} onCreate={handleCreateTask} />
    </div>
  );
}