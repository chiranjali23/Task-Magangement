import React from "react";
import "./Rightbar.css";
import { Link } from "react-router-dom";


export default function RightPanel({
  user = { name: "William Jones" },
  stats = { total: 6, inProgress: 4, open: 4, completed: 2 },
  completion = 6, // just a demo number for the gauge caption
}) {
  const completedPct = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <aside className="rp">
      <div className="rp-card rp-hello">
        <div className="rp-avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
        <div>
          <div className="rp-hello-title">Hello,</div>
          <div className="rp-hello-name">{user.name}</div>
        </div>
      </div>

      {/* Totals grid */}
      <div className="rp-card">
        <div className="rp-card-title">Overview</div>
        <div className="rp-grid">
          <div className="rp-kpi">
            <div className="rp-kpi-num">{stats.total}</div>
            <div className="rp-kpi-label">Total Tasks</div>
          </div>
          <div className="rp-kpi">
            <div className="rp-kpi-num">{stats.inProgress}</div>
            <div className="rp-kpi-label">In Progress</div>
          </div>
          <div className="rp-kpi">
            <div className="rp-kpi-num">{stats.open}</div>
            <div className="rp-kpi-label">Open</div>
          </div>
          <div className="rp-kpi">
            <div className="rp-kpi-num">{stats.completed}</div>
            <div className="rp-kpi-label">Completed</div>
          </div>
        </div>
      </div>

      {/* Simple gauge (no libs) */}
      <div className="rp-card">
        <div className="rp-card-title">Completed vs Pending</div>
        <div className="rp-gauge">
          <div
            className="rp-gauge-arc"
            style={{ "--value": `${completedPct}deg` }}
          />
          <div className="rp-gauge-center">
            <div className="rp-gauge-num">{completion}</div>
            <div className="rp-gauge-sub">Tasks</div>
          </div>
        </div>
        <div className="rp-note">
          Task completion improved by <b>{completedPct}%</b> this week.
        </div>
      </div>

      <div className="rp-logout">
        <Link to ='/'>Logout</Link>
      </div>
    </aside>
  );
}
