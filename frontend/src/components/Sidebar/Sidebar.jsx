import { Box, Button, Typography } from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useToast } from "../Toast/toastStore";
import logoFull from "../../assets/logo-with-name.png";
import logoIcon from "../../assets/small-Logo.png";
import { sidebarSx } from "./Sidebar.styles";

function NavItem({ icon, label, active = false, collapsed = false, onClick }) {
  return (
    <Button onClick={onClick} sx={sidebarSx.navItem(active, collapsed)}>
      <Box component="span" sx={sidebarSx.navIcon}>
        {icon}
      </Box>
      {!collapsed && <Box component="span">{label}</Box>}
    </Button>
  );
}

export default function Sidebar({ collapsed, onToggleCollapsed, currentPage, onNavigate }) {
  const { addToast } = useToast();
  const notReady = () => addToast("warning", "Warning", "Page Not Ready Yet");

  return (
    <Box component="aside" sx={sidebarSx.root(collapsed)}>
      <Box sx={sidebarSx.brand(collapsed)}>
        <Box
          component="img"
          src={collapsed ? logoIcon : logoFull}
          alt="NextStep Logo"
          sx={sidebarSx.brandImage(collapsed)}
        />
      </Box>

      <Box component="nav" sx={sidebarSx.nav}>
        {!collapsed && (
          <Typography sx={sidebarSx.navLabel}>JOBS</Typography>
        )}
        <NavItem
          active={currentPage === "dashboard" || !currentPage}
          collapsed={collapsed}
          icon={<WorkOutlineRoundedIcon fontSize="small" />}
          label="Job Applications"
          onClick={() => onNavigate?.("dashboard")}
        />
        <NavItem
          active={currentPage === "resume"}
          collapsed={collapsed}
          icon={<DescriptionOutlinedIcon fontSize="small" />}
          label="Resumes"
          onClick={() => onNavigate?.("resume")}
        />
        <NavItem
          collapsed={collapsed}
          icon={<AutoAwesomeOutlinedIcon fontSize="small" />}
          label="Subscriptions"
          onClick={notReady}
        />
        <NavItem
          active={currentPage === "archive"}
          collapsed={collapsed}
          icon={<ArchiveOutlinedIcon fontSize="small" />}
          label="Archive"
          onClick={() => onNavigate?.("archive")}
        />
      </Box>

      <Box sx={sidebarSx.footerWrap}>
        <Box sx={sidebarSx.footerRow(collapsed)}>
          <NavItem
            collapsed={collapsed}
            icon={<SettingsOutlinedIcon fontSize="small" />}
            label="Settings"
            onClick={notReady}
          />

          <Button
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            sx={sidebarSx.collapseBtn}
          >
            {collapsed ? (
              <ArrowForwardIosOutlinedIcon fontSize="small" />
            ) : (
              <ArrowBackIosNewOutlinedIcon fontSize="small" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
