// src/components/Sidebar/Sidebar.jsx
import "./sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandLogo">N</div>
        <div className="brandText">
          <div className="brandName">NextStep</div>
          <div className="brandSub">Job Tracker</div>
        </div>
      </div>

      <nav className="nav">
        <button className="navItem active">📌Job Applications</button>
        <button className="navItem">📅 Resumes</button>
        <button className="navItem">📊 Archive</button>
        <button className="navItem">⚙️ Settings</button>
      </nav>

      <div className="sidebarFooter">
        <div className="hintTitle">Tip</div>
        <div className="hintText">
          Use the <b>+</b> in each column to add a job directly there.
        </div>
      </div>
    </aside>
  );
}
