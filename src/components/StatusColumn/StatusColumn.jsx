import { Box, Button, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BookmarksRoundedIcon from "@mui/icons-material/BookmarksRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import JobCard from "../JobCard/JobCard";
import useTheme from "../../hooks/useTheme";
import { statusColumnSx } from "./StatusColumn.styles";

export default function StatusColumn({
  status,
  jobs,
  onDelete,
  onEdit,
  onMoveTo,
  onAdd,
  onSelect,
}) {
  const { theme: mode } = useTheme();
  const emptyText = getEmptyText(status);
  const emptyTheme = getEmptyTheme(status, mode);
  const headerTheme = getHeaderTheme(status, mode);
  const HeaderIcon = headerTheme.icon;
  const EmptyIcon = emptyTheme.icon;

  return (
    <Box sx={statusColumnSx.root}>
      <Box sx={statusColumnSx.headerPill(headerTheme.color)}>
        <Box sx={statusColumnSx.headerIcon}>
          <HeaderIcon fontSize="small" />
        </Box>
        <Typography sx={statusColumnSx.headerTitle}>{status}</Typography>
        <Button
          onClick={onAdd}
          aria-label={`Add job to ${status}`}
          title={`Add job to ${status}`}
          sx={statusColumnSx.addBtn(headerTheme.color)}
        >
          <AddRoundedIcon fontSize="small" />
        </Button>
      </Box>

      <Box sx={statusColumnSx.list}>
        {jobs.length === 0 ? (
          <Box sx={statusColumnSx.emptyWrap}>
            <Typography sx={statusColumnSx.emptyLabel(emptyTheme.border)}>
              <AutoAwesomeRoundedIcon fontSize="inherit" />
              Empty State
            </Typography>

            <Box
              sx={statusColumnSx.emptyBox(
                emptyTheme.border,
                emptyTheme.gradient,
              )}
            >
              <Box sx={statusColumnSx.emptyIcon(emptyTheme.border)}>
                <EmptyIcon sx={{ fontSize: 42 }} />
              </Box>
              <Typography sx={statusColumnSx.emptyTitle(emptyTheme.border)}>
                {emptyText}
              </Typography>
              <Typography sx={statusColumnSx.emptyHint}>
                Click + to add a job
              </Typography>
            </Box>
          </Box>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={onDelete}
              onEdit={onEdit}
              onMoveTo={onMoveTo}
              onSelect={onSelect}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

function getEmptyText(status) {
  const s = status.toLowerCase();
  if (s.includes("interview")) return "Add Your First Interview Here!";
  if (s.includes("offer")) return "Add Your First Job Offer Here!";
  if (s.includes("applied")) return "Add Your First Application Here!";
  if (s.includes("wishlist")) return "Add Your First Job To Your Wishlist!";
  return "Add Your First Item Here!";
}

function getHeaderTheme(status) {
  const s = status.toLowerCase();
  const make = (color, icon) => ({ color, icon });
  if (s.includes("wishlist")) return make("#7c3aed", BookmarksRoundedIcon);
  if (s.includes("applied")) return make("#ef4444", SendRoundedIcon);
  if (s.includes("interview")) return make("#f59e0b", ForumRoundedIcon);
  if (s.includes("offer")) return make("#10b981", WorkspacePremiumRoundedIcon);
  return make("#94a3b8", PushPinRoundedIcon);
}

function getEmptyTheme(status, mode) {
  const s = status.toLowerCase();
  const isDark = mode === "dark";

  if (s.includes("wishlist"))
    return {
      border: "#7c3aed",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(255,255,255,1))",
      icon: BookmarksRoundedIcon,
    };
  if (s.includes("applied"))
    return {
      border: "#ef4444",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(239,68,68,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(239,68,68,0.22), rgba(255,255,255,1))",
      icon: SendRoundedIcon,
    };
  if (s.includes("interview"))
    return {
      border: "#f59e0b",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(245,158,11,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(245,158,11,0.22), rgba(255,255,255,1))",
      icon: ForumRoundedIcon,
    };
  if (s.includes("offer"))
    return {
      border: "#10b981",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(255,255,255,1))",
      icon: WorkspacePremiumRoundedIcon,
    };
  return {
    border: "#94a3b8",
    gradient: isDark
      ? "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(20,20,30,1))"
      : "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(255,255,255,1))",
    icon: PushPinRoundedIcon,
  };
}
