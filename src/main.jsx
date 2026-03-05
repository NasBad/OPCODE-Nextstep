import { createRoot } from "react-dom/client";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ToastProvider } from "./components/Toast/ToastContext";
import App from "./App.jsx";
import { appGlobalStyles } from "./theme/globalStyles";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <CssBaseline />
    <GlobalStyles styles={appGlobalStyles} />
    <App />
  </ToastProvider>,
);
