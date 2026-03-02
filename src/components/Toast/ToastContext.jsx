import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext();

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
        <div style={containerStyle}>
          {toasts.map((toast) => (
            <ToastCard
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

/* ------------------ Toast Card ------------------ */

function ToastCard({ toast, onClose }) {
  const config = toastStyles[toast.type];

  return (
    <div style={{ ...cardStyle, borderLeft: `6px solid ${config.color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ ...iconCircle, background: config.color }}>
          {config.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{toast.title}</div>
          <div style={{ fontSize: 14, color: "#555" }}>{toast.message}</div>
        </div>

        <button onClick={onClose} style={closeBtn}>
          ✕
        </button>
      </div>
    </div>
  );
}

/* ------------------ Styles ------------------ */

const containerStyle = {
  position: "fixed",
  bottom: 20,
  right: 20,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  zIndex: 999999,
};

const cardStyle = {
  width: 360,
  background: "#fff",
  borderRadius: 16,
  padding: 18,
  boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  animation: "slideIn 0.3s ease",
};

const iconCircle = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: 20,
  fontWeight: 900,
};

const closeBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 18,
  opacity: 0.6,
};

const toastStyles = {
  success: { color: "#16a34a", icon: "✓" },
  error: { color: "#dc2626", icon: "✕" },
  warning: { color: "#d97706", icon: "!" },
};
