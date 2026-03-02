// src/AppShell.jsx
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
  return (
    <div className="shell">
      <Sidebar />

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
