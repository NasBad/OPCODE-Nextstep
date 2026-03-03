import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { STATUSES } from "../../constants/statuses";
import styles from "./JobCard.module.css";

export default function JobCard({ job, onDelete, onEdit, onMoveTo, onSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Move modal state
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [toStatus, setToStatus] = useState(job.status || STATUSES[0]);

  // Delete confirm modal state
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const kebabRef = useRef(null);
  const menuRef = useRef(null);

  const [pos, setPos] = useState({ top: 0, left: 0 });

  const closeMenu = () => setMenuOpen(false);

  const fromStatus = job.status || "Wishlist";
  const theme = useMemo(() => getStatusTheme(fromStatus), [fromStatus]);

  const calcPosition = () => {
    const btn = kebabRef.current;
    if (!btn) return;

    const r = btn.getBoundingClientRect();

    const MENU_W = 190;
    const MENU_H = 210;
    const GAP = 8;

    let left = r.right - MENU_W;
    let top = r.bottom + GAP;

    const minLeft = 8;
    const maxLeft = window.innerWidth - MENU_W - 8;
    left = Math.min(Math.max(left, minLeft), maxLeft);

    const bottomSpace = window.innerHeight - r.bottom;
    if (bottomSpace < MENU_H + 16) {
      top = r.top - GAP - MENU_H;
    }

    setPos({ top, left });
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    if (!menuOpen) {
      calcPosition();
      setMenuOpen(true);
    } else {
      closeMenu();
    }
  };

  // close menu on outside click + reposition on scroll/resize
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDownCapture = (e) => {
      const path = e.composedPath?.() || [];
      const clickedMenu = menuRef.current && path.includes(menuRef.current);
      const clickedKebab = kebabRef.current && path.includes(kebabRef.current);
      if (clickedMenu || clickedKebab) return;
      closeMenu();
    };

    const onScrollOrResize = () => {
      if (!menuOpen) return;
      calcPosition();
    };

    document.addEventListener("pointerdown", onPointerDownCapture, true);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      document.removeEventListener("pointerdown", onPointerDownCapture, true);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [menuOpen]);

  // keep modal dropdown synced if job status changes externally
  useEffect(() => {
    setToStatus(job.status || STATUSES[0]);
  }, [job.status]);

  const openMoveModal = () => {
    closeMenu();
    const defaultTo = STATUSES.find((s) => s !== fromStatus) || fromStatus;
    setToStatus(defaultTo);
    setMoveModalOpen(true);
  };

  const confirmMove = () => {
    if (!toStatus || toStatus === fromStatus) return;
    onMoveTo(job.id, toStatus);
    setMoveModalOpen(false);
  };

  const addedText = useMemo(() => {
    const dateStr = job.createdAt || job.updatedAt;
    if (!dateStr) return "Added recently";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "Added recently";

    const diffMs = Date.now() - d.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) return "Added today";
    if (days === 1) return "Added 1 day ago";
    return `Added ${days} days ago`;
  }, [job.createdAt, job.updatedAt]);

  return (
    <div
      className={styles.card}
      onClick={() => onSelect?.(job)}
      style={{
        background: theme.card.background,
        borderColor: theme.card.borderColor,
      }}
    >
      {/* Header row */}
      <div className={styles.topRow}>
        <div className={styles.brandRow}>
          <div
            className={styles.logoCircle}
            style={{ background: theme.logoBg }}
          >
            {getInitials(job.companyName)}
          </div>

          <div className={styles.brandText}>
            <div className={styles.companyName}>{job.companyName}</div>
            <div className={styles.subtitle}>
              {job.jobTitle}
              {job.location ? `, ${job.location}` : ""}
              {job.workType ? ` • ${job.workType}` : ""}
            </div>
          </div>
        </div>

        <button
          type="button"
          ref={kebabRef}
          onClick={toggleMenu}
          className={styles.kebabBtn}
          aria-label="Card menu"
          title="Menu"
        >
          ⋮
        </button>

        {/* Menu */}
        {menuOpen &&
          createPortal(
            <div
              ref={menuRef}
              className={styles.menuBox}
              style={{ top: pos.top, left: pos.left }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.menuInner}>
                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={() => {
                    closeMenu();
                    onEdit(job);
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  type="button"
                  className={styles.menuItem}
                  onClick={openMoveModal}
                >
                  📌 Move to…
                </button>

                <div style={{ height: 8 }} />

                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.dangerItem}`}
                  onClick={() => {
                    closeMenu();
                    setConfirmDeleteOpen(true);
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>,
            document.body,
          )}
      </div>

      {/* Tags */}
      {Array.isArray(job.tags) && job.tags.length > 0 && (
        <div className={styles.tagsRow}>
          {job.tags.slice(0, 6).map((t) => (
            <span key={t} className={styles.tagPill}>
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.footerRow}>
        <div className={styles.metaRow}>
          <span className={styles.clockIcon}>🕒</span>
          <span className={styles.metaText}>{addedText}</span>
        </div>

        <button
          type="button"
          className={styles.infoBtn}
          title="Info"
          onClick={() => alert(`${job.jobTitle} @ ${job.companyName}`)}
        >
          i
        </button>
      </div>

      {/* Move Modal */}
      {moveModalOpen &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) setMoveModalOpen(false);
            }}
          >
            <div
              className={styles.modalBox}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className={styles.modalTitle}>Move Job</div>

              <div className={styles.field}>
                <div className={styles.label}>From</div>
                <input className={styles.input} value={fromStatus} disabled />
              </div>

              <div className={styles.field}>
                <div className={styles.label}>To</div>
                <select
                  className={styles.select}
                  value={toStatus}
                  onChange={(e) => setToStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} disabled={s === fromStatus}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => setMoveModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className={styles.btnPrimary}
                  style={{
                    opacity: !toStatus || toStatus === fromStatus ? 0.6 : 1,
                    cursor:
                      !toStatus || toStatus === fromStatus
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={confirmMove}
                  disabled={!toStatus || toStatus === fromStatus}
                >
                  Move
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Delete Confirm Modal */}
      {confirmDeleteOpen &&
        createPortal(
          <div
            className={styles.modalOverlay}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) setConfirmDeleteOpen(false);
            }}
          >
            <div
              className={styles.modalBox}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className={styles.modalTitle}>Delete Job</div>

              <div className={styles.confirmText}>
                Are you sure you want to delete{" "}
                <strong>{job.companyName}</strong>?
                <br />
                This action cannot be undone.
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => setConfirmDeleteOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className={`${styles.btnPrimary} ${styles.btnDanger}`}
                  onClick={() => {
                    onDelete(job.id);
                    setConfirmDeleteOpen(false);
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
  );
}

/* ---------- Theme mapping ---------- */
function getStatusTheme(status) {
  const s = (status || "").toLowerCase();

  if (s.includes("wishlist")) {
    return {
      card: { background: "#f3efff", borderColor: "#e2d9ff" },
      logoBg: "#ffffff",
    };
  }
  if (s.includes("applied")) {
    return {
      card: { background: "#fff0f1", borderColor: "#ffd4d8" },
      logoBg: "#ffffff",
    };
  }
  if (s.includes("interview")) {
    return {
      card: { background: "#fff8db", borderColor: "#ffe89e" },
      logoBg: "#ffffff",
    };
  }
  if (s.includes("offer")) {
    return {
      card: { background: "#eafff2", borderColor: "#b9f3d2" },
      logoBg: "#ffffff",
    };
  }
  return {
    card: { background: "#f3f4f6", borderColor: "#e5e7eb" },
    logoBg: "#ffffff",
  };
}

function getInitials(name) {
  if (!name) return "•";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}
