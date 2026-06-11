import { Box, Button } from "@mui/material";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useToast } from "../../components/Toast/toastStore";
import { dashboardHeaderSx } from "./DashboardHeader.styles";

export default function DashboardHeader({ viewMode, onChangeView, jobs = [] }) {
  const isKanban = viewMode === "kanban";
  const { addToast } = useToast();

  const handleExport = () => {
    if (jobs.length === 0) {
      addToast("warning", "No Data", "No jobs to export");
      return;
    }

    const headers = ["Company", "Job Title", "Status", "Location", "Work Type", "Tags", "Applied Date", "Platform", "Notes", "Created At", "Updated At"];
    const rows = jobs.map((j) => [
      j.companyName || "",
      j.jobTitle || "",
      j.status || "",
      j.location || "",
      j.workType || "",
      (j.tags || []).join("; "),
      j.appliedDate || "",
      j.platform || "",
      j.notes || "",
      j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "",
      j.updatedAt ? new Date(j.updatedAt).toLocaleDateString() : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nextstep_jobs.csv";
    a.click();
    URL.revokeObjectURL(url);
    addToast("success", "Exported!", `${jobs.length} jobs exported as CSV`);
  };

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
        onClick={handleExport}
        startIcon={<FileDownloadOutlinedIcon />}
        sx={dashboardHeaderSx.exportBtn}
      >
        Export
      </Button>
    </Box>
  );
}
