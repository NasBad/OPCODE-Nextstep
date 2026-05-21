export const appShellSx = {
  root: (collapsed) => ({
    height: "100vh",
    width: "100%",
    display: "grid",
    gridTemplateColumns: collapsed ? "76px 1fr" : "260px 1fr",
    overflow: "hidden",
  }),
  main: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  content: {
    minWidth: 0,
    flex: 1,
    overflow: "auto",
    p: "22px 22px 26px",
  },
};
