import { createRoot } from "react-dom/client";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "./components/Toast/ToastContext";
import App from "./App.jsx";
import { appGlobalStyles } from "./theme/globalStyles";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <CssBaseline />
      <GlobalStyles styles={appGlobalStyles} />
      <App />
    </ToastProvider>
  </QueryClientProvider>,
);
