import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import { appShellSx } from "./AppShell.styles";

export default function AppShell({ children, searchValue, onSearchChange }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem("sidebar") === "collapsed";
  });

  useEffect(() => {
    localStorage.setItem("sidebar", sidebarCollapsed ? "collapsed" : "expanded");
  }, [sidebarCollapsed]);

  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

  return (
    <Box sx={appShellSx.root(sidebarCollapsed)}>
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapsed={toggleSidebar} />
      <Box sx={appShellSx.main}>
        <Topbar searchValue={searchValue} onSearchChange={onSearchChange} />
        <Box component="main" sx={appShellSx.content}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
