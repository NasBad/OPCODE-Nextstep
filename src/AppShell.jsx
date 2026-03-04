// src/AppShell.jsx
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import "./appShell.css";

export default function AppShell({
  children,
  searchValue,
  onSearchChange,
  onToggleTheme,
  theme,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar") === "collapsed";
  });

  useEffect(() => {
    localStorage.setItem(
      "sidebar",
      sidebarCollapsed ? "collapsed" : "expanded",
    );
  }, [sidebarCollapsed]);

  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

  return (
    <div className={`shell ${sidebarCollapsed ? "sidebarCollapsed" : ""}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={toggleSidebar} />

      <div className="shellMain">
        <Topbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />

        <main className="shellContent">{children}</main>
      </div>
    </div>
  );
}
