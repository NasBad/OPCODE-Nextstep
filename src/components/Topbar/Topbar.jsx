// src/components/Topbar/Topbar.jsx
import "./topbar.css";

export default function Topbar({
  searchValue,
  onSearchChange,
  onToggleTheme,
  theme,
}) {
  return (
    <header className="topbar">
      <div className="topbarLeft">
        <div className="pageTitle">Job Application</div>
        <div className="pageSub"></div>
      </div>

      <div className="topbarRight">
        <div className="searchBox">
          <span className="searchIcon">🔎</span>
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, company, tags..."
          />
        </div>

        <button
          className="ghostBtn"
          onClick={onToggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
}
