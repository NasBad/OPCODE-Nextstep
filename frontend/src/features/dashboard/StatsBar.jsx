import { Box, Typography } from "@mui/material";
import useTheme from "../../hooks/useTheme";

const STATS = [
  { label: "Total",        key: "total",        light: { bg: "#f0f4ff", border: "#c5d0e8", text: "#3b5bdb" }, dark: { bg: "#1e2a45", border: "#2d3f6b", text: "#7b9cff" } },
  { label: "Wishlist",     key: "Wishlist",      light: { bg: "#f3efff", border: "#e2d9ff", text: "#6c3de8" }, dark: { bg: "#2b1f4a", border: "#5b3dbd", text: "#b39dff" } },
  { label: "Applied",      key: "Applied",       light: { bg: "#fff0f1", border: "#ffd4d8", text: "#c0392b" }, dark: { bg: "#3a1c22", border: "#b91c1c", text: "#ff8a8a" } },
  { label: "Interviewing", key: "Interviewing",  light: { bg: "#fff8db", border: "#ffe89e", text: "#b45309" }, dark: { bg: "#3a2f0f", border: "#d97706", text: "#fcd34d" } },
  { label: "Offer",        key: "Offer",         light: { bg: "#eafff2", border: "#b9f3d2", text: "#0d7a45" }, dark: { bg: "#12392b", border: "#10b981", text: "#6ee7b7" } },
];

export default function StatsBar({ jobs = [] }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const counts = {
    total: jobs.length,
    Wishlist: jobs.filter((j) => j.status === "Wishlist").length,
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interviewing: jobs.filter((j) => j.status === "Interviewing").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
  };

  return (
    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
      {STATS.map(({ label, key, light, dark }) => {
        const colors = isDark ? dark : light;
        return (
          <Box
            key={key}
            sx={{
              flex: "1 1 0",
              minWidth: 90,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 1.25,
              px: 1,
              borderRadius: "12px",
              background: colors.bg,
              border: `1.5px solid ${colors.border}`,
              transition: "background 0.2s, border 0.2s",
            }}
          >
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: colors.text, lineHeight: 1.1 }}>
              {counts[key]}
            </Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.text, opacity: 0.75, mt: 0.25, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
