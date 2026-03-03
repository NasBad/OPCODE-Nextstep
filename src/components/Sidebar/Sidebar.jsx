// src/components/Sidebar/Sidebar.jsx
import "./sidebar.css";
import logo from "../../assets/logo-with-name.png";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img src={logo} alt="NextStep Logo" className="brandImage" />
      </div>

      <nav className="nav">
        <button className="navItem active">📌Job Applications</button>
        <button className="navItem">📅 Resumes</button>
        <button className="navItem">🌟 Subscriptions</button>
        <button className="navItem">📊 Archive</button>
      </nav>

      <div className="sidebarFooter">
        <button className="navItem">⚙️ Settings</button>
      </div>
    </aside>
  );
}
