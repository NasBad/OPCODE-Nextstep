// src/components/Topbar/Topbar.jsx
import "./topbar.css";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import avatar from "../../assets/avatar.png";

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
        <button
          className="ghostBtn"
          onClick={onToggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
        <div className="searchBox">
          <span className="searchIcon">🔎</span>
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, company, tags..."
          />
        </div>
        <ProfileMenu
          name="Naseem Badran"
          avatarSrc={avatar}
          onAction={(key) => {
            if (key === "logout") alert("logout clicked");
            if (key === "profile") alert("profile clicked");
            if (key === "settings") alert("settings clicked");
          }}
        />
      </div>
    </header>
  );
}
