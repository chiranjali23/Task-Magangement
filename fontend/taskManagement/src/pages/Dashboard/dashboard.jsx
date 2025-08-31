import React, { useState } from "react";
import DashboardNavbar from "../../componnets/DashboardNavbar/DashboardNavbar.jsx";
import Sidebar from "../../componnets/sidebar/sidebar.jsx";
import Taskcard from "../../componnets/TaskCard/Taskcard.jsx";
import TaskModal from "../../componnets/TaskModel/TaskModel.jsx";
import "./dashboard.css";

export default function Dashboard() {
  const [showNew, setShowNew] = useState(false);
  const [tasks, setTasks] = useState([
    { when:"Today", title:"Complete React Project", desc:"Finish the dashboard and task card components.", priority:"high" },
    { when:"Tomorrow", title:"Team Meeting", desc:"Discuss project updates and next steps.", priority:"medium" },
  ]);

  function handleCreateTask(newTask){
    setTasks(prev => [{ ...newTask, id: crypto.randomUUID?.() ?? Date.now() }, ...prev]);
  }

  return (
    <div className="dashboard">
      <div className="dashboardnavbar">
        {/* pass a click handler into the navbar */}
        <DashboardNavbar onAddTaskClick={() => setShowNew(true)} />
      </div>

      <div className="dashboard-content">
        <Sidebar />
        <div className="task-area">
          <div className="task-area-head">
            <h2>All Tasks</h2>
            <button className="add-btn" onClick={() => setShowNew(true)}>Add a new Task</button>
          </div>

          <div className="tasks">
            {tasks.map((t,i)=> <Taskcard key={i} task={t} />)}
          </div>
        </div>
      </div>

      {/* modal lives here; covers whole screen */}
      <TaskModal open={showNew} onClose={()=>setShowNew(false)} onCreate={handleCreateTask} />
    </div>
  );
}
