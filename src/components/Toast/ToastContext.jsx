import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import "./toast.css";

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
        <div className="toastContainer">
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
  const config = toastStyles[toast.type] || toastStyles.warning;

  return (
    <div
      className={`toastCard toast-${toast.type}`}
      style={{ borderLeftColor: config.color }}
    >
      <div className="toastContent">
        <div className="toastIcon" style={{ background: config.color }}>
          {config.icon}
        </div>

        <div className="toastText">
          <div className="toastTitle">{toast.title}</div>
          <div className="toastMessage">{toast.message}</div>
        </div>

        <button className="toastClose" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}

const toastStyles = {
  success: { color: "#16a34a", icon: "✓" },
  error: { color: "#dc2626", icon: "✕" },
  warning: { color: "#d97706", icon: "!" },
};
