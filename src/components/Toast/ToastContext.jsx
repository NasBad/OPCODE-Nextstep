import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Box, Button, Typography } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { ToastContext } from "./toastStore";
import { toastSx } from "./Toast.styles";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type, title, message) => {
      const id = crypto.randomUUID();
      const newToast = { id, type, title, message };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {createPortal(
        <Box sx={toastSx.container}>
          {toasts.map((toast) => (
            <ToastCard
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </Box>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

function ToastCard({ toast, onClose }) {
  const config = toastStyles[toast.type] || toastStyles.warning;
  const Icon = config.icon;

  return (
    <Box sx={toastSx.card(config.color)}>
      <Box sx={toastSx.content}>
        <Box sx={toastSx.iconWrap(config.color)}>
          <Icon sx={{ fontSize: 20, color: "#fff" }} />
        </Box>
        <Box sx={toastSx.text}>
          <Typography sx={toastSx.title}>{toast.title}</Typography>
          <Typography sx={toastSx.message}>{toast.message}</Typography>
        </Box>
        <Button onClick={onClose} sx={toastSx.closeBtn}>
          <CloseRoundedIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}

const toastStyles = {
  success: { color: "#16a34a", icon: DoneOutlinedIcon },
  error: { color: "#dc2626", icon: ClearOutlinedIcon },
  warning: { color: "#d97706", icon: ReportProblemOutlinedIcon },
};
