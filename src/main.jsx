import { ToastProvider } from "./components/Toast/ToastContext";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <App />
  </ToastProvider>,
);
