import "./sidebar.css";
import { useEffect, useState } from "react";
import { useToast } from "../Toast/ToastContext";

import logoFull from "../../assets/logo-with-name.png";
import logoIcon from "../../assets/small-logo.png";

export default function Sidebar({ collapsed, onToggleCollapsed }) {
  const { addToast } = useToast();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <img
          src={collapsed ? logoIcon : logoFull}
          alt="NextStep Logo"
          className="brandImage"
        />
      </div>

      <nav className="nav">
        <button className="navItem active">
          <span className="navIcon">📌</span>
          <span className="navText">Job Applications</span>
        </button>

        <button
          className="navItem"
          onClick={() => addToast("warning", "Warning", "Page Not Ready Yet")}
        >
          <span className="navIcon">📅</span>
          <span className="navText">Resumes</span>
        </button>

        <button
          className="navItem"
          onClick={() => addToast("warning", "Warning", "Page Not Ready Yet")}
        >
          <span className="navIcon">🌟</span>
          <span className="navText">Subscriptions</span>
        </button>

        <button
          className="navItem"
          onClick={() => addToast("warning", "Warning", "Page Not Ready Yet")}
        >
          <span className="navIcon">📊</span>
          <span className="navText">Archive</span>
        </button>
      </nav>

      <div className="sidebarFooter">
        <div className="footerRow">
          <button
            className="navItem"
            onClick={() => addToast("warning", "Warning", "Page Not Ready Yet")}
          >
            <span className="navIcon">⚙️</span>
            <span className="navText">Settings</span>
          </button>

          {/* Arrow button */}
          <button
            className="collapseBtn"
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>
        </div>
      </div>
    </aside>
  );
}
