import { Box, Button } from "@mui/material";
import ViewKanbanRoundedIcon from "@mui/icons-material/ViewKanbanRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import { dashboardHeaderSx } from "./DashboardHeader.styles";

export default function DashboardHeader({ viewMode, onToggleView }) {
  const isKanban = viewMode === "kanban";
  return (
    <Box sx={dashboardHeaderSx.row}>
      <Button type="button" onClick={onToggleView} aria-label="Toggle Kanban/List view" startIcon={isKanban ? <ViewListRoundedIcon /> : <ViewKanbanRoundedIcon />} sx={dashboardHeaderSx.toggleBtn}>
        {isKanban ? "List View" : "Kanban View"}
      </Button>
    </Box>
  );
}
