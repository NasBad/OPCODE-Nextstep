import { Box, Button, Typography } from "@mui/material";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

export default function ArchivePage({ jobs = [], onRestore }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 1, color: "var(--text)" }}>
        Archive
      </Typography>
      <Typography sx={{ fontSize: 14, color: "var(--text-2)", mb: 3 }}>
        Deleted jobs and Rejected applications
      </Typography>

      {jobs.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 8, color: "var(--text-2)" }}>
          <Typography sx={{ fontSize: 16 }}>No archived jobs yet.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {jobs.map((job) => (
            <ArchiveCard key={job.id} job={job} onRestore={onRestore} />
          ))}
        </Box>
      )}
    </Box>
  );
}

function ArchiveCard({ job, onRestore }) {
  const dateStr = job.updatedAt || job.createdAt;
  const dateLabel = dateStr
    ? new Date(dateStr).toLocaleDateString()
    : "Unknown date";

  const reason = job.isDeleted ? "Deleted" : "Rejected";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 2,
        border: "1px solid var(--border)",
        background: "var(--panel)",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--panel-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 13,
            color: "var(--text)",
            flexShrink: 0,
          }}
        >
          {getInitials(job.companyName)}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }} noWrap>
            {job.companyName}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "var(--text-2)" }} noWrap>
            {job.jobTitle}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 600,
            background: reason === "Rejected" ? "#ffd4d8" : "#e5e7eb",
            color: reason === "Rejected" ? "#b91c1c" : "#374151",
          }}
        >
          {reason}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "var(--text-2)" }}>
          <AccessTimeRoundedIcon sx={{ fontSize: 13 }} />
          <Typography sx={{ fontSize: 12 }}>{dateLabel}</Typography>
        </Box>

        {job.isDeleted && (
          <Button
            size="small"
            startIcon={<RestoreRoundedIcon fontSize="small" />}
            onClick={() => onRestore?.(job.id)}
            sx={{
              fontSize: 12,
              textTransform: "none",
              color: "var(--primary, #7c3aed)",
              "&:hover": { background: "var(--panel-2)" },
            }}
          >
            Restore
          </Button>
        )}
      </Box>
    </Box>
  );
}

function getInitials(name) {
  if (!name) return "*";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
