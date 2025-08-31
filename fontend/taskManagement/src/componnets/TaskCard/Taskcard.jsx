import { useEffect, useRef, useState } from "react";
import './Taskcard.css';

export default function TaskModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "", description: "", priority: "low", dueDate: "", completed: "no"
  });
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({ title:"", description:"", priority:"low", dueDate:"", completed:"no" });
      setTimeout(() => titleRef.current?.focus(), 0);
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  function handleChange(e){ const {name,value} = e.target; setForm(p=>({...p,[name]:value})); }
  function submit(e){
    e.preventDefault();
    if (!form.title.trim()) return;
    onCreate?.({
      title: form.title.trim(),
      desc: form.description.trim(),
      priority: form.priority,
      when: form.dueDate || "Today",
      completed: form.completed === "yes",
    });
    onClose?.();
  }

  if (!open) return null;

  return (
    <div className="tm-overlay" onClick={(e)=>e.target===e.currentTarget && onClose?.()}>
      <div className="tm-dialog" role="dialog" aria-modal="true">
        <form onSubmit={submit}>
          <div className="tm-field">
            <label className="tm-label">Title</label>
            <input ref={titleRef} name="title" className="tm-input" placeholder="Task Title"
                   value={form.title} onChange={handleChange} required />
          </div>

          <div className="tm-field">
            <label className="tm-label">Description</label>
            <textarea name="description" className="tm-textarea" rows={3}
                      placeholder="Task Description" value={form.description} onChange={handleChange}/>
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
            <button type="submit" className="tm-btn primary">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
