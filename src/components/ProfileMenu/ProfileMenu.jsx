import { useEffect, useRef, useState } from "react";
import { Box, Button, Divider } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import avatar from "../../assets/avatar.png";
import { useToast } from "../Toast/toastStore";
import { profileMenuSx } from "./ProfileMenu.styles";

export default function ProfileMenu({ name = "Naseem Badran", avatarSrc = avatar }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const { addToast } = useToast();

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;

    const onPointerDownCapture = (e) => {
      const path = e.composedPath?.() || [];
      const clickedBtn = btnRef.current && path.includes(btnRef.current);
      const clickedMenu = menuRef.current && path.includes(menuRef.current);
      if (clickedBtn || clickedMenu) return;
      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const notReady = () => addToast("warning", "Warning", "Page Not Ready Yet");

  return (
    <Box sx={profileMenuSx.wrap}>
      <Button ref={btnRef} onClick={toggle} sx={profileMenuSx.trigger}>
        <Box component="img" src={avatarSrc} alt="Profile" sx={profileMenuSx.avatar} />
        <Box component="span" sx={profileMenuSx.name}>
          {name}
        </Box>
        {open ? <KeyboardArrowUpRoundedIcon fontSize="small" /> : <KeyboardArrowDownRoundedIcon fontSize="small" />}
      </Button>

      {open && (
        <Box ref={menuRef} sx={profileMenuSx.menu}>
          <Button fullWidth onClick={notReady} sx={profileMenuSx.item}>
            <PersonRoundedIcon fontSize="small" />
            Profile
          </Button>
          <Button fullWidth onClick={notReady} sx={profileMenuSx.item}>
            <SettingsRoundedIcon fontSize="small" />
            Settings
          </Button>
          <Divider sx={{ my: 0.75, borderColor: "var(--border)" }} />
          <Button fullWidth onClick={notReady} sx={profileMenuSx.dangerItem}>
            <LogoutRoundedIcon fontSize="small" />
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}
