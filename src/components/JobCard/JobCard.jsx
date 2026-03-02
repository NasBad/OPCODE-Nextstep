import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STATUSES } from "../../constants/statuses";

export default function JobCard({ job, onDelete, onEdit, onMoveTo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const kebabRef = useRef(null);
  const menuRef = useRef(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  const closeAll = () => {
    setMenuOpen(false);
    setMoveOpen(false);
  };

  const calcPosition = () => {
    const btn = kebabRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();

    const MENU_W = 190;
    const GAP = 8;

    let left = r.right - MENU_W + window.scrollX;
    let top = r.bottom + GAP + window.scrollY;

    const minLeft = 8 + window.scrollX;
    const maxLeft = window.innerWidth - MENU_W - 8 + window.scrollX;
    left = Math.min(Math.max(left, minLeft), maxLeft);

    const MENU_H = 210;
    const bottomSpace = window.innerHeight - r.bottom;
    if (bottomSpace < MENU_H + 16) {
      top = r.top - GAP - MENU_H + window.scrollY;
    }

    setPos({ top, left });
  };

  const toggleMenu = () => {
    if (!menuOpen) {
      calcPosition();
      setMenuOpen(true);
      setMoveOpen(false);
    } else {
      closeAll();
    }
  };

  useEffect(() => {
    const onMouseDown = (e) => {
      if (!menuOpen) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      if (kebabRef.current && kebabRef.current.contains(e.target)) return;
      closeAll();
    };

    const onScrollOrResize = () => {
      if (!menuOpen) return;
      calcPosition();
    };

    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  return (
    <div style={cardStyle}>
      {/* Top row */}
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
      >
        <div style={{ display: "grid", gap: 6 }}>
          <div style={titleStyle}>{job.jobTitle}</div>
          <div style={companyStyle}>{job.companyName}</div>
        </div>

        <button
          ref={kebabRef}
          onClick={toggleMenu}
          style={kebabBtn}
          aria-label="Card menu"
          title="Menu"
        >
          ⋮
        </button>

        {/* Menu portal */}
        {menuOpen &&
          createPortal(
            <div
              ref={menuRef}
              style={{ ...menuBox, top: pos.top, left: pos.left }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={menuInner}>
                <button
                  style={menuItem}
                  onClick={() => {
                    closeAll();
                    onEdit?.(job);
                  }}
                >
                  ✏️ Edit
                </button>

                <button style={menuItem} onClick={() => setMoveOpen((v) => !v)}>
                  📌 Move to…
                </button>

                {moveOpen && (
                  <div style={moveList}>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        style={moveItem}
                        onClick={() => {
                          onMoveTo?.(job.id, s);
                          closeAll();
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ height: 8 }} />

                <button
                  style={dangerItem}
                  onClick={() => {
                    closeAll();
                    setConfirmOpen(true);
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>,
            document.body,
          )}

        {/* Confirm delete modal */}
        {confirmOpen &&
          createPortal(
            <div style={confirmOverlay} onClick={() => setConfirmOpen(false)}>
              <div style={confirmBox} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: 0, color: "#111" }}>Delete Job?</h3>

                <div style={{ fontSize: 14, color: "#555", lineHeight: 1.4 }}>
                  Are you sure you want to delete <b>{job.jobTitle}</b> at{" "}
                  <b>{job.companyName}</b>?
                </div>

                <div style={confirmActions}>
                  <button
                    style={cancelBtn}
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    style={confirmDeleteBtn}
                    onClick={() => {
                      setConfirmOpen(false);
                      onDelete?.(job.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </div>

      {/* Description */}
      {job.location || job.workType ? (
        <div style={descStyle}>
          {job.location ? `📍 ${job.location}` : ""}
          {job.location && job.workType ? " • " : ""}
          {job.workType ? `💼 ${job.workType}` : ""}
        </div>
      ) : null}

      {/* Tags */}
      {Array.isArray(job.tags) && job.tags.length > 0 && (
        <div style={tagsRow}>
          {job.tags.map((t) => (
            <span key={t} style={tag}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* --- styles --- */
const cardStyle = {
  background: "#fff",
  borderRadius: 14,
  padding: 12,
  border: "1px solid #eee",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
};

const titleStyle = { fontWeight: 800, color: "#111" };
const companyStyle = { color: "#444", fontSize: 13 };
const descStyle = { marginTop: 8, color: "#333", fontSize: 13 };

const tagsRow = { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 };
const tag = {
  fontSize: 12,
  background: "#f1f5ff",
  border: "1px solid #dbe6ff",
  color: "#1a3a8a",
  padding: "4px 8px",
  borderRadius: 999,
};

const kebabBtn = {
  border: "1px solid #ddd",
  background: "#fff",
  borderRadius: 10,
  width: 34,
  height: 34,
  cursor: "pointer",
  fontSize: 18,
  lineHeight: "18px",
  display: "grid",
  placeItems: "center",
};

const menuBox = {
  position: "absolute",
  width: 190,
  maxHeight: 210,
  overflow: "hidden",
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: 12,
  boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
  padding: 8,
  zIndex: 999999,
};

const menuInner = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  maxHeight: 210,
  overflowY: "auto",
  paddingRight: 4,
};

const menuItem = {
  width: "100%",
  textAlign: "left",
  border: "none",
  background: "transparent",
  padding: "10px 10px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
  color: "#111",
};

const dangerItem = {
  ...menuItem,
  color: "#b00020",
  background: "#fff5f5",
  border: "1px solid #ffd7d7",
};

const moveList = {
  borderTop: "1px solid #eee",
  paddingTop: 6,
  display: "grid",
  gap: 6,
  maxHeight: 110,
  overflowY: "auto",
  paddingRight: 4,
};

const moveItem = {
  width: "100%",
  textAlign: "left",
  border: "1px solid #eee",
  background: "#fafafa",
  padding: "8px 10px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
  color: "#111",
};

/* Confirm modal styles */
const confirmOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999999,
};

const confirmBox = {
  width: "min(380px, 92vw)",
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
  display: "grid",
  gap: 12,
};

const confirmActions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 8,
};

const cancelBtn = {
  border: "1px solid #ddd",
  background: "#f7f7f7",
  borderRadius: 10,
  padding: "8px 14px",
  cursor: "pointer",
  fontWeight: 600,
};

const confirmDeleteBtn = {
  border: "1px solid #b00020",
  background: "#b00020",
  color: "#fff",
  borderRadius: 10,
  padding: "8px 14px",
  cursor: "pointer",
  fontWeight: 700,
};
