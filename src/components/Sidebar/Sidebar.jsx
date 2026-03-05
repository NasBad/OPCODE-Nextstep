import { Box, Button } from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
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
          icon={<DescriptionRoundedIcon fontSize="small" />}
          label="Resumes"
          onClick={notReady}
        />
        <NavItem
          collapsed={collapsed}
          icon={<AutoAwesomeRoundedIcon fontSize="small" />}
          label="Subscriptions"
          onClick={notReady}
        />
        <NavItem
          collapsed={collapsed}
          icon={<ArchiveRoundedIcon fontSize="small" />}
          label="Archive"
          onClick={notReady}
        />
      </Box>

      <Box sx={sidebarSx.footerWrap}>
        <Box sx={sidebarSx.footerRow(collapsed)}>
          <NavItem
            collapsed={collapsed}
            icon={<SettingsRoundedIcon fontSize="small" />}
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
              <KeyboardDoubleArrowRightRoundedIcon fontSize="small" />
            ) : (
              <KeyboardDoubleArrowLeftRoundedIcon fontSize="small" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
