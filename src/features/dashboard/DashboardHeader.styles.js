export const dashboardHeaderSx = {
  row: {
    width: "100%",
    maxWidth: 1600,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 1.5,
  },
  toggleGroup: {
    display: "inline-flex",
    alignItems: "center",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    overflow: "hidden",
    background: "color-mix(in srgb, var(--panel) 70%, transparent)",
  },
  toggleBtn: (active) => ({
    textTransform: "none",
    border: "none",
    borderRadius: 0,
    borderRight: "1px solid var(--border)",
    background: "transparent",
    color: active ? "#3b82f6" : "inherit",
    px: 2,
    py: 1,
    minWidth: 120,
    fontWeight: active ? 700 : 600,
    "&:last-of-type": {
      borderRight: "none",
    },
    "& .MuiButton-startIcon": {
      color: active ? "#3b82f6" : "inherit",
    },
    "&:hover": {
      background: "color-mix(in srgb, var(--panel) 82%, transparent)",
    },
  }),
};
