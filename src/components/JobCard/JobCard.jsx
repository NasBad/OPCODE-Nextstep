import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DriveFileMoveRoundedIcon from "@mui/icons-material/DriveFileMoveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { STATUSES } from "../../constants/statuses";
import useTheme from "../../hooks/useTheme";
import { jobCardSx } from "./JobCard.styles";

export default function JobCard({ job, onDelete, onEdit, onMoveTo, onSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [toStatus, setToStatus] = useState(job.status || STATUSES[0]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const kebabRef = useRef(null);
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const closeMenu = () => setMenuOpen(false);
  const fromStatus = job.status || "Wishlist";
  const statusTheme = useMemo(() => getStatusTheme(fromStatus, theme), [fromStatus, theme]);

  const calcPosition = () => {
    const btn = kebabRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const MENU_W = 190;
    const MENU_H = 210;
    const GAP = 8;
    let left = r.right - MENU_W;
    let top = r.bottom + GAP;
    left = Math.min(Math.max(left, 8), window.innerWidth - MENU_W - 8);
    if (window.innerHeight - r.bottom < MENU_H + 16) top = r.top - GAP - MENU_H;
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
      if (menuOpen) calcPosition();
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
    return `Added ${d.toLocaleDateString()}`;
  }, [job.createdAt, job.updatedAt]);

  return (
    <Box sx={jobCardSx.card(statusTheme.card)}>
      <Box sx={jobCardSx.topRow}>
        <Box sx={jobCardSx.brandRow}>
          <Box sx={jobCardSx.logoCircle(statusTheme.logoBg)}>{getInitials(job.companyName)}</Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={jobCardSx.companyName}>{job.companyName}</Typography>
            <Typography sx={jobCardSx.subtitle}>{job.jobTitle}</Typography>
            <Typography sx={jobCardSx.subtitle}>
              {job.location ? ` ${job.location} ,` : ""}
              {job.workType ? ` ${job.workType}` : ""}
            </Typography>
          </Box>
        </Box>

        <Button ref={kebabRef} onClick={toggleMenu} sx={jobCardSx.kebabBtn} aria-label="Card menu">
          <MoreVertRoundedIcon fontSize="small" />
        </Button>

        {menuOpen &&
          createPortal(
            <Box
              ref={menuRef}
              sx={jobCardSx.menuBox(pos)}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <Box sx={jobCardSx.menuInner}>
                <Button
                  type="button"
                  startIcon={<EditRoundedIcon fontSize="small" />}
                  sx={jobCardSx.menuItem}
                  onClick={() => {
                    closeMenu();
                    onEdit(job);
                  }}
                >
                  Edit
                </Button>

                <Button type="button" startIcon={<DriveFileMoveRoundedIcon fontSize="small" />} sx={jobCardSx.menuItem} onClick={openMoveModal}>
                  Move to...
                </Button>

                <Button
                  type="button"
                  startIcon={<DeleteRoundedIcon fontSize="small" />}
                  sx={jobCardSx.dangerItem}
                  onClick={() => {
                    closeMenu();
                    setConfirmDeleteOpen(true);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>,
            document.body,
          )}
      </Box>

      {Array.isArray(job.tags) && job.tags.length > 0 && (
        <Box sx={jobCardSx.tagsRow}>
          {job.tags.slice(0, 6).map((t) => (
            <Box key={t} component="span" sx={jobCardSx.tagPill}>
              {t}
            </Box>
          ))}
        </Box>
      )}

      <Box sx={jobCardSx.footerRow}>
        <Box sx={jobCardSx.metaRow}>
          <AccessTimeRoundedIcon sx={{ fontSize: 15, opacity: 0.75 }} />
          <Typography sx={jobCardSx.metaText}>{addedText}</Typography>
        </Box>

        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(job);
          }}
          sx={jobCardSx.infoBtn}
        >
          <InfoOutlinedIcon sx={{ fontSize: 14 }} />
        </Button>
      </Box>

      {moveModalOpen &&
        createPortal(
          <Box sx={jobCardSx.modalOverlay} onPointerDown={(e) => e.target === e.currentTarget && setMoveModalOpen(false)}>
            <Box sx={jobCardSx.modalBox} onPointerDown={(e) => e.stopPropagation()}>
              <Typography sx={jobCardSx.modalTitle}>Move Job</Typography>
              <Box sx={jobCardSx.field}>
                <Typography sx={jobCardSx.label}>From</Typography>
                <TextField value={fromStatus} disabled size="small" sx={jobCardSx.input("var(--panel-2)")} />
              </Box>
              <Box sx={jobCardSx.field}>
                <Typography sx={jobCardSx.label}>To</Typography>
                <Select value={toStatus} onChange={(e) => setToStatus(e.target.value)} size="small" sx={jobCardSx.input("var(--panel)")}>
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s} disabled={s === fromStatus}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={jobCardSx.modalActions}>
                <Button type="button" onClick={() => setMoveModalOpen(false)} sx={jobCardSx.btnGhost}>
                  Cancel
                </Button>
                <Button type="button" onClick={confirmMove} disabled={!toStatus || toStatus === fromStatus} sx={jobCardSx.btnPrimary}>
                  Move
                </Button>
              </Box>
            </Box>
          </Box>,
          document.body,
        )}

      {confirmDeleteOpen &&
        createPortal(
          <Box sx={jobCardSx.modalOverlay} onPointerDown={(e) => e.target === e.currentTarget && setConfirmDeleteOpen(false)}>
            <Box sx={jobCardSx.modalBox} onPointerDown={(e) => e.stopPropagation()}>
              <Typography sx={jobCardSx.modalTitle}>Delete Job</Typography>
              <Typography sx={jobCardSx.confirmText}>
                Are you sure you want to delete <strong>{job.companyName}</strong>?
                <br />
                This action cannot be undone.
              </Typography>
              <Box sx={jobCardSx.modalActions}>
                <Button type="button" onClick={() => setConfirmDeleteOpen(false)} sx={jobCardSx.btnGhost}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    onDelete(job.id);
                    setConfirmDeleteOpen(false);
                  }}
                  sx={jobCardSx.btnDanger}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>,
          document.body,
        )}
    </Box>
  );
}

function getStatusTheme(status, theme) {
  const s = (status || "").toLowerCase();
  const isDark = theme === "dark";
  if (s.includes("wishlist")) return isDark ? { card: { background: "#2b1f4a", borderColor: "#5b3dbd" }, logoBg: "#3a2c6b" } : { card: { background: "#f3efff", borderColor: "#e2d9ff" }, logoBg: "#ffffff" };
  if (s.includes("applied")) return isDark ? { card: { background: "#3a1c22", borderColor: "#b91c1c" }, logoBg: "#4a222a" } : { card: { background: "#fff0f1", borderColor: "#ffd4d8" }, logoBg: "#ffffff" };
  if (s.includes("interview")) return isDark ? { card: { background: "#3a2f0f", borderColor: "#d97706" }, logoBg: "#4a3a14" } : { card: { background: "#fff8db", borderColor: "#ffe89e" }, logoBg: "#ffffff" };
  if (s.includes("offer")) return isDark ? { card: { background: "#12392b", borderColor: "#10b981" }, logoBg: "#184c39" } : { card: { background: "#eafff2", borderColor: "#b9f3d2" }, logoBg: "#ffffff" };
  return isDark ? { card: { background: "#1e293b", borderColor: "#334155" }, logoBg: "#2a3446" } : { card: { background: "#f3f4f6", borderColor: "#e5e7eb" }, logoBg: "#ffffff" };
}

function getInitials(name) {
  if (!name) return "*";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}
