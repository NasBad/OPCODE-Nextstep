import { Box, Button } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useToast } from "../../components/Toast/toastStore";
import { dashboardHeaderSx } from "./DashboardHeader.styles";

export default function DashboardHeader({ viewMode, onChangeView }) {
  const isKanban = viewMode === "kanban";
  const { addToast } = useToast();

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

      <Button
        type="button"
        onClick={() => addToast("warning", "Warning", "Feature Not Ready Yet")}
        startIcon={<FileDownloadOutlinedIcon />}
        sx={dashboardHeaderSx.exportBtn}
      >
        Export
      </Button>
    </Box>
  );
}
