export const appShellSx = {
  root: (collapsed) => ({
    height: "100%",
    width: "100%",
    display: "grid",
    gridTemplateColumns: collapsed ? "76px 1fr" : "260px 1fr",
  }),
  main: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    minWidth: 0,
    p: "22px 22px 26px",
  },
};
