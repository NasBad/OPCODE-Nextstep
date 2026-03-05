import { Box, Button, Chip, TextField, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useToast } from "../Toast/toastStore";
import { jobDetailsDrawerSx } from "./JobDetailsDrawer.styles";

export default function JobDetailsDrawer({ job, open, onClose }) {
  const { addToast } = useToast();
  const statusColor = getStatusColor(job?.status);
  if (!open) return null;

  return (
    <>
      <Box onClick={onClose} sx={jobDetailsDrawerSx.overlay} />

      <Box component="aside" role="dialog" aria-modal="true" sx={jobDetailsDrawerSx.drawer}>
        <Box sx={jobDetailsDrawerSx.header}>
          <Box sx={jobDetailsDrawerSx.companyRow}>
            <Box sx={jobDetailsDrawerSx.companyInitial}>{getInitials(job?.companyName)}</Box>
            <Box sx={jobDetailsDrawerSx.titleBlock}>
              <Typography sx={jobDetailsDrawerSx.jobTitle}>{job?.jobTitle || "Untitled"}</Typography>
              <Typography sx={jobDetailsDrawerSx.companyName}>{job?.companyName || "Company"}</Typography>
              {job?.status && (
                <Chip
                  size="small"
                  label={job.status}
                  sx={jobDetailsDrawerSx.statusPill(statusColor)}
                />
              )}
            </Box>
          </Box>

          <Button onClick={onClose} title="Close" sx={jobDetailsDrawerSx.closeBtn}>
            <CloseRoundedIcon fontSize="small" />
          </Button>
        </Box>

        <Box sx={jobDetailsDrawerSx.body}>
          <Section title="Details">
            <InfoRow label="Location" value={job?.location || "-"} />
            <InfoRow label="Work Type" value={job?.workType || "-"} />
            <InfoRow label="Job URL" value={job?.jobUrl || "-"} isLink />
          </Section>

          <Section title="Tags">
            {Array.isArray(job?.tags) && job.tags.length > 0 ? (
              <Box sx={jobDetailsDrawerSx.tags}>
                {job.tags.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    sx={jobDetailsDrawerSx.tag(statusColor)}
                  />
                ))}
              </Box>
            ) : (
              <Typography sx={jobDetailsDrawerSx.muted}>No tags</Typography>
            )}
          </Section>

          <Section title="Extra">
            <InfoRow label="Created" value={fmtDate(job?.createdAt)} />
            <InfoRow label="Updated" value={fmtDate(job?.updatedAt)} />
            <InfoRow label="Platform" value={job?.platform || "-"} />
          </Section>

          <Section title="Notes">
            <TextField
              multiline
              minRows={4}
              placeholder="Add a note here..."
              defaultValue={job?.notes || ""}
              InputProps={{ readOnly: true }}
              sx={jobDetailsDrawerSx.textarea}
            />
            <Typography sx={jobDetailsDrawerSx.noteHint}>
              (Later we can make notes editable + saved)
            </Typography>
          </Section>
        </Box>

        <Box sx={jobDetailsDrawerSx.footer}>
          <Button
            onClick={() => addToast("warning", "Warning", "Feature Not Ready Yet")}
            startIcon={<EventAvailableRoundedIcon />}
            sx={jobDetailsDrawerSx.primaryBtn}
          >
            Schedule Interview
          </Button>
        </Box>
      </Box>
    </>
  );
}

function Section({ title, children }) {
  return (
    <Box sx={jobDetailsDrawerSx.section}>
      <Typography sx={jobDetailsDrawerSx.sectionTitle}>{title}</Typography>
      <Box sx={jobDetailsDrawerSx.sectionBody}>{children}</Box>
    </Box>
  );
}

function InfoRow({ label, value, isLink }) {
  const isUrl = typeof value === "string" && value.startsWith("http");
  return (
    <Box sx={jobDetailsDrawerSx.row}>
      <Typography sx={jobDetailsDrawerSx.rowLabel}>{label}</Typography>
      <Typography sx={jobDetailsDrawerSx.rowValue}>
        {isLink && isUrl ? (
          <a href={value} target="_blank" rel="noreferrer">
            {value}
          </a>
        ) : (
          value
        )}
      </Typography>
    </Box>
  );
}

function getInitials(name) {
  if (!name) return "*";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

function fmtDate(v) {
  if (!v) return "-";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}

function getStatusColor(status) {
  const normalized = (status || "").toLowerCase().replace(/\s+/g, "");
  if (normalized.includes("wishlist")) return "#9b5cf6";
  if (normalized.includes("applied")) return "#3b82f6";
  if (normalized.includes("interviewing")) return "#f59e0b";
  if (normalized.includes("offer")) return "#22c55e";
  return "var(--text)";
}
