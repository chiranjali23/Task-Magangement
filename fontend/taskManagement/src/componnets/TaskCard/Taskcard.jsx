import "./TaskCard.css";
import { FaFlag, FaStar, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const pri = (task.priority || "low").toLowerCase();
  const priColor = { low: "#16a34a", medium: "#f59e0b", high: "#ef4444" }[pri];

  return (
    <div className={`tc-card ${task.completed ? "completed" : ""}`}>
      <div className="tc-body">
        <h3 className="tc-title">{task.title}</h3>
        <p className="tc-desc">{task.desc}</p>
      </div>

      <div className="tc-footer">
        <span className="tc-when">{task.when}</span>

        <span className="tc-priority" style={{ color: priColor }}>
          <FaFlag className="tc-flag" />
          {pri}
        </span>

        <div className="tc-actions">
          <button
            className={`tc-icon star-btn ${task.completed ? "active" : ""}`}
            title="Mark Complete"
            onClick={() => onToggleComplete?.(task.id)}
          >
            <FaStar />
          </button>
          <button className="tc-icon" title="Edit" onClick={() => onEdit?.(task)}>
            <FaEdit />
          </button>
          <button className="tc-icon" title="Delete" onClick={() => onDelete?.(task.id)}>
            <FaTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
}
