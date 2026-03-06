import { Box, Button } from "@mui/material";
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

export default function Sidebar({ collapsed, onToggleCollapsed }) {
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
        <NavItem
          active
          collapsed={collapsed}
          icon={<WorkOutlineRoundedIcon fontSize="small" />}
          label="Job Applications"
        />
        <NavItem
          collapsed={collapsed}
          icon={<DescriptionOutlinedIcon fontSize="small" />}
          label="Resumes"
          onClick={notReady}
        />
        <NavItem
          collapsed={collapsed}
          icon={<AutoAwesomeOutlinedIcon fontSize="small" />}
          label="Subscriptions"
          onClick={notReady}
        />
        <NavItem
          collapsed={collapsed}
          icon={<ArchiveOutlinedIcon fontSize="small" />}
          label="Archive"
          onClick={notReady}
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
