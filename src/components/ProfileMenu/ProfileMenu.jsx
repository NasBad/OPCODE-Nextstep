import { useEffect, useRef, useState } from "react";
import styles from "./ProfileMenu.module.css";
import avatar from "../../assets/avatar.png";
import { useToast } from "../Toast/ToastContext";

export default function ProfileMenu({
  name = "Naseem Badran",
  avatarSrc = { avatar },
  onAction,
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const { addToast } = useToast();

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  // close on outside click / esc
  useEffect(() => {
    if (!open) return;

    const onPointerDownCapture = (e) => {
      const path = e.composedPath?.() || [];
      const clickedBtn = btnRef.current && path.includes(btnRef.current);
      const clickedMenu = menuRef.current && path.includes(menuRef.current);
      if (clickedBtn || clickedMenu) return;
      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const clickItem = (key) => {
    setOpen(false);
    onAction?.(key);
  };

  return (
    <div className={styles.wrap}>
      <button ref={btnRef} className={styles.trigger} onClick={toggle}>
        <img className={styles.avatar} src={avatarSrc} alt="Profile" />
        <span className={styles.name}>{name}</span>
        <span className={styles.chev}>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div ref={menuRef} className={styles.menu}>
          <button
            className={styles.item}
            onClick={() => addToast("warning", "Warning", "Page Not Ready Yet")}
          >
            👤 Profile
          </button>
          <button
            className={styles.item}
            onClick={() => addToast("warning", "Warning", "Page Not Ready Yet")}
          >
            ⚙️ Settings
          </button>
          <div className={styles.sep} />
          <button
            className={`${styles.item} ${styles.danger}`}
            onClick={() => addToast("warning", "Warning", "Page Not Ready Yet")}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  );
}
