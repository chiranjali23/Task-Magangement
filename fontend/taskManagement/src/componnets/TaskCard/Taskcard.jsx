import "./TaskCard.css";
import { FaFlag, FaRegStar, FaEdit, FaTrashAlt } from "react-icons/fa";

export default function TaskCard({ task }) {
  const pri = (task.priority || "low").toLowerCase();
  const priColor = { low: "#16a34a", medium: "#f59e0b", high: "#ef4444" }[pri];

  return (
    <div className="tc-card">
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
          <button className="tc-icon" title="Star"><FaRegStar /></button>
          <button className="tc-icon" title="Edit"><FaEdit /></button>
          <button className="tc-icon" title="Delete"><FaTrashAlt /></button>
        </div>
      </div>
    </div>
  );
}
