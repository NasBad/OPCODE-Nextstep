import { Box, Button } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import { dashboardHeaderSx } from "./DashboardHeader.styles";

export default function DashboardHeader({ viewMode, onChangeView }) {
  const isKanban = viewMode === "kanban";
  return (
    <Box sx={dashboardHeaderSx.row}>
      <Box sx={dashboardHeaderSx.toggleGroup}>
        <Button
          type="button"
          onClick={() => onChangeView("list")}
          aria-label="Switch to List view"
          startIcon={<FormatListBulletedOutlinedIcon />}
          sx={dashboardHeaderSx.toggleBtn(!isKanban)}
        >
          List
        </Button>
        <Button
          type="button"
          onClick={() => onChangeView("kanban")}
          aria-label="Switch to Kanban view"
          startIcon={<WidgetsOutlinedIcon />}
          sx={dashboardHeaderSx.toggleBtn(isKanban)}
        >
          Kanban
        </Button>
      </Box>
    </Box>
  );
}
