import { Box, IconButton, InputBase, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import avatar from "../../assets/avatar.png";
import useTheme from "../../hooks/useTheme";
import { topbarSx } from "./Topbar.styles";

export default function Topbar({ searchValue, onSearchChange }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Box component="header" sx={topbarSx.root}>
      <Box>
        <Typography sx={topbarSx.title}>Job Application</Typography>
      </Box>

      <Box sx={topbarSx.right}>
        <IconButton onClick={toggleTheme} title="Toggle theme" sx={topbarSx.ghostBtn}>
          {theme === "dark" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
        </IconButton>

        <Box sx={topbarSx.searchBox}>
          <SearchRoundedIcon sx={topbarSx.searchIcon} />
          <InputBase
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, company, tags..."
            sx={topbarSx.searchInput}
          />
        </Box>

        <ProfileMenu name="Naseem Badran" avatarSrc={avatar} />
      </Box>
    </Box>
  );
}
