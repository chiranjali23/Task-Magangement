import { useEffect, useState } from "react";
import "./profile.css";

export default function ProfileModal({
  open,
  user,                 // { id, name, email }
  onClose,
  onSaveProfile,        // (payload: {name, email}) => void|Promise
  onChangePassword      // (payload: {currentPassword, newPassword}) => void|Promise
}) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ name: user?.name || "", email: user?.email || "" });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
      setShowPw(false);
      setError("");
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open, user]);

  function change(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (error) setError("");
  }

  function changePw(e) {
    const { name, value } = e.target;
    setPwForm(p => ({ ...p, [name]: value }));
    if (error) setError("");
  }

  async function saveProfile(e) {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim()) return setError("Email is required");

    try {
      await onSaveProfile?.({ name: form.name.trim(), email: form.email.trim() });
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (!pwForm.currentPassword) return setError("Current password is required");
    if (!pwForm.newPassword) return setError("New password is required");
    if (pwForm.newPassword.length < 6) return setError("New password must be at least 6 characters");
    if (pwForm.newPassword !== pwForm.confirm) return setError("Passwords do not match");

    try {
      await onChangePassword?.({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      onClose?.();
    } catch (err) {
      setError(err?.message || "Failed to change password");
    }
  }

  if (!open) return null;

  return (
    <div className="pm-overlay" onClick={(e)=>e.target===e.currentTarget && onClose?.()}>
      <div className="pm-dialog" role="dialog" aria-modal="true" aria-label="Profile">
        <h3 className="pm-title">Profile</h3>

        {error && <div className="pm-error">{error}</div>}

        <form className="pm-section" onSubmit={saveProfile}>
          <div className="pm-field">
            <label className="pm-label">Full Name</label>
            <input
              name="name"
              className="pm-input"
              value={form.name}
              onChange={change}
              placeholder="Your name"
              required
            />
          </div>

          <div className="pm-field">
            <label className="pm-label">Email</label>
            <input
              name="email"
              type="email"
              className="pm-input"
              value={form.email}
              onChange={change}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="pm-actions">
            <button type="button" className="pm-btn ghost" onClick={onClose}>Close</button>
            <button type="submit" className="pm-btn primary">Save Changes</button>
          </div>
        </form>

        <div className="pm-divider" />

        <button className="pm-toggle" onClick={() => setShowPw(v => !v)}>
          {showPw ? "Hide Password Change" : "Change Password"}
        </button>

        {showPw && (
          <form className="pm-section" onSubmit={savePassword}>
            <div className="pm-field">
              <label className="pm-label">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                className="pm-input"
                value={pwForm.currentPassword}
                onChange={changePw}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="pm-row">
              <div className="pm-field">
                <label className="pm-label">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  className="pm-input"
                  value={pwForm.newPassword}
                  onChange={changePw}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="pm-field">
                <label className="pm-label">Confirm New Password</label>
                <input
                  name="confirm"
                  type="password"
                  className="pm-input"
                  value={pwForm.confirm}
                  onChange={changePw}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pm-actions">
              <button type="button" className="pm-btn ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="pm-btn warn">Update Password</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
