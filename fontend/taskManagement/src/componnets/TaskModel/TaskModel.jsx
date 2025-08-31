import { useEffect, useState } from "react";
import "./TaskModel.css";

export default function TaskModal({
  open,
  mode = "create",               // "create" | "edit"
  initialTask = null,            // when editing
  onClose,
  onCreate,                      // (payload) => void
  onUpdate,                      // (id, payload) => void
}) {
  const [form, setForm] = useState({
    title: "", description: "", priority: "low", dueDate: "", completed: "no"
  });

  // preload values when editing or when opening
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialTask) {
      setForm({
        title: initialTask.title || "",
        description: initialTask.desc || "",
        priority: (initialTask.priority || "low").toLowerCase(),
        dueDate: initialTask.when || "",
        completed: initialTask.completed ? "yes" : "no",
      });
    } else {
      setForm({ title:"", description:"", priority:"low", dueDate:"", completed:"no" });
    }
  }, [open, mode, initialTask]);

  function handleChange(e){
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
  }

  function handleSubmit(e){
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      desc: form.description.trim(),
      priority: form.priority,
      when: form.dueDate,
      completed: form.completed === "yes",
    };
    if (mode === "edit") onUpdate?.(initialTask.id, payload);
    else onCreate?.(payload);
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className="tm-overlay" onClick={(e)=>e.target===e.currentTarget && onClose?.()}>
      <div className="tm-dialog" role="dialog" aria-modal="true">
        <h3 style={{marginTop:0}}>{mode === "edit" ? "Edit Task" : "Create Task"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="tm-field">
            <label className="tm-label">Title</label>
            <input name="title" className="tm-input" value={form.title} onChange={handleChange} required />
          </div>

          <div className="tm-field">
            <label className="tm-label">Description</label>
            <textarea name="description" className="tm-textarea" rows={3}
                      value={form.description} onChange={handleChange}/>
          </div>

          <div className="tm-row">
            <div className="tm-field">
              <label className="tm-label">Select Priority</label>
              <select name="priority" className="tm-input" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
            <div className="tm-field">
              <label className="tm-label">Due Date</label>
              <input type="date" name="dueDate" className="tm-input" value={form.dueDate} onChange={handleChange}/>
            </div>
          </div>

          <div className="tm-field">
            <label className="tm-label">Task Completed</label>
            <select name="completed" className="tm-input" value={form.completed} onChange={handleChange}>
              <option value="no">No</option><option value="yes">Yes</option>
            </select>
          </div>

          <div className="tm-actions">
            <button type="button" className="tm-btn ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="tm-btn primary">
              {mode === "edit" ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
