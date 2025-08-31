import { useEffect, useRef, useState } from "react";
import "./TaskModel.css";

export default function TaskModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "low",
    dueDate: "",
    completed: "no",
  });

  const dialogRef = useRef(null);
  const titleRef = useRef(null);

  // reset + autofocus when opened
  useEffect(() => {
    if (open) {
      setForm({ title: "", description: "", priority: "low", dueDate: "", completed: "no" });
      setTimeout(() => titleRef.current?.focus(), 0);
    }
  }, [open]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return; // simple validation
    // parent decides whether to POST to API or just push to state
    onCreate?.({
      title: form.title.trim(),
      desc: form.description.trim(),
      priority: form.priority,
      when: form.dueDate ? new Date(form.dueDate).toDateString() : "Today",
      completed: form.completed === "yes",
    });
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className="tm-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="tm-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Create Task">
        <form onSubmit={handleSubmit}>
          <div className="tm-field">
            <label className="tm-label">Title</label>
            <input
              ref={titleRef}
              name="title"
              type="text"
              className="tm-input"
              placeholder="Task Title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="tm-field">
            <label className="tm-label">Description</label>
            <textarea
              name="description"
              className="tm-textarea"
              placeholder="Task Description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="tm-row">
            <div className="tm-field">
              <label className="tm-label">Select Priority</label>
              <select
                name="priority"
                className="tm-input"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="tm-field">
              <label className="tm-label">Due Date</label>
              <input
                name="dueDate"
                type="date"
                className="tm-input"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="tm-field">
            <label className="tm-label">Task Completed</label>
            <select
              name="completed"
              className="tm-input"
              value={form.completed}
              onChange={handleChange}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="tm-actions">
            <button type="button" className="tm-btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="tm-btn primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
