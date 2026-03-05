import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import { listViewSx, getStatusColor } from "./ListView.styles";

export default function ListView({
  jobs,
  statuses,
  onMoveTo,
  onDelete,
  onSelect,
  onEdit,
  onExport,
}) {
  const grouped = useMemo(() => {
    const map = {};
    statuses.forEach((s) => (map[s] = []));
    jobs.forEach((j) => {
      const s = j.status ?? statuses[0];
      if (!map[s]) map[s] = [];
      map[s].push(j);
    });
    return map;
  }, [jobs, statuses]);

  const [collapsed, setCollapsed] = useState(() => {
    const init = {};
    statuses.forEach((s) => (init[s] = false));
    return init;
  });

  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [openMenuId, setOpenMenuId] = useState(null);
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const containerRef = useRef(null);
  const bulkMoveRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenMenuId(null);
        setBulkMoveOpen(false);
        return;
      }
      if (bulkMoveRef.current && !bulkMoveRef.current.contains(e.target)) setBulkMoveOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const activeSelectedIds = useMemo(() => {
    const validIds = new Set(jobs.map((j) => j.id));
    return new Set([...selectedIds].filter((id) => validIds.has(id)));
  }, [jobs, selectedIds]);

  const selectedJobs = useMemo(() => jobs.filter((j) => activeSelectedIds.has(j.id)), [jobs, activeSelectedIds]);
  const selectedCount = activeSelectedIds.size;

  const toggleRow = (id) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const clearSelection = () => setSelectedIds(new Set());

  const isAllSelectedInSection = (status) => {
    const list = grouped[status] ?? [];
    if (!list.length) return false;
    return list.every((j) => activeSelectedIds.has(j.id));
  };

  const toggleSelectAllInSection = (status) => {
    const list = grouped[status] ?? [];
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const all = list.every((j) => next.has(j.id));
      if (all) list.forEach((j) => next.delete(j.id));
      else list.forEach((j) => next.add(j.id));
      return next;
    });
  };

  const bulkMove = (newStatus) => {
    if (!newStatus) return;
    selectedJobs.forEach((j) => onMoveTo(j.id, newStatus));
    clearSelection();
  };

  const bulkDelete = () => {
    selectedJobs.forEach((j) => onDelete(j.id));
    clearSelection();
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <Box ref={containerRef} sx={listViewSx.root}>
      {statuses.map((status) => {
        const list = grouped[status] ?? [];
        const count = list.length;
        const isCollapsed = collapsed[status];
        const statusColor = getStatusColor(status);

        return (
          <Box key={status} sx={listViewSx.section}>
            <Button
              type="button"
              onClick={() => setCollapsed((p) => ({ ...p, [status]: !p[status] }))}
              aria-label={`Toggle ${status}`}
              sx={listViewSx.sectionHeader}
            >
              <ExpandMoreRoundedIcon sx={listViewSx.chevron(isCollapsed)} />
              <Typography component="span" sx={listViewSx.sectionTitle(statusColor)}>
                {status}
              </Typography>
              <Typography component="span" sx={listViewSx.sectionCount}>
                {count}
              </Typography>
            </Button>

            {!isCollapsed && (
              <Paper sx={listViewSx.table}>
                {count > 0 && (
                  <Box sx={listViewSx.headRow}>
                    <Box sx={listViewSx.checkCell}>
                      <Checkbox
                        checked={isAllSelectedInSection(status)}
                        onChange={() => toggleSelectAllInSection(status)}
                        size="small"
                        sx={listViewSx.checkbox}
                      />
                    </Box>
                    <Typography sx={listViewSx.headText}>Job</Typography>
                    <Typography sx={listViewSx.headTextTags}>Tags</Typography>
                    <Typography sx={listViewSx.headTextDate}>Date</Typography>
                    <Box />
                  </Box>
                )}

                {count === 0 ? (
                  <Typography sx={listViewSx.empty}>No jobs here yet.</Typography>
                ) : (
                  list.map((job, index) => {
                    const checked = activeSelectedIds.has(job.id);
                    const tags = Array.isArray(job.tags) ? job.tags : [];
                    return (
                      <Box
                        key={job.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => onSelect(job)}
                        onKeyDown={(e) => e.key === "Enter" && onSelect(job)}
                        sx={listViewSx.row(checked, index)}
                      >
                        <Box sx={listViewSx.checkCell} onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleRow(job.id)}
                            size="small"
                            sx={listViewSx.checkbox}
                          />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Box sx={listViewSx.titleRow}>
                            <Typography component="span" sx={listViewSx.company}>
                              {job.companyName}
                            </Typography>
                            <Typography component="span" sx={listViewSx.role}>
                              {job.jobTitle}
                            </Typography>
                            <Typography component="span" sx={listViewSx.meta}>
                              {job.location ? `, ${job.location}` : ""}
                              {job.workType ? ` - ${job.workType}` : ""}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={listViewSx.tagsWrap}>
                          {tags.slice(0, 6).map((t) => (
                            <Box key={t} component="span" sx={listViewSx.tag(statusColor)}>
                              {t}
                            </Box>
                          ))}
                          {tags.length > 6 && (
                            <Box component="span" sx={listViewSx.tagMore(statusColor)}>
                              +{tags.length - 6}
                            </Box>
                          )}
                        </Box>

                        <Typography sx={listViewSx.date}>{formatDate(job.updatedAt ?? job.createdAt)}</Typography>

                        <Box sx={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
                          <Button
                            type="button"
                            aria-label="Row actions"
                            onClick={() => setOpenMenuId((p) => (p === job.id ? null : job.id))}
                            sx={listViewSx.kebabBtn}
                          >
                            <MoreVertRoundedIcon fontSize="small" />
                          </Button>

                          {openMenuId === job.id && (
                            <Box sx={listViewSx.rowMenu}>
                              <Button fullWidth startIcon={<EditRoundedIcon fontSize="small" />} onClick={() => { setOpenMenuId(null); onEdit?.(job); }} sx={listViewSx.menuItem}>
                                Edit
                              </Button>
                              <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
                              <Typography sx={listViewSx.menuLabel}>Move to</Typography>
                              <Box sx={listViewSx.moveGrid}>
                                {statuses.map((s) => (
                                  <Button key={s} onClick={() => { setOpenMenuId(null); onMoveTo(job.id, s); }} sx={listViewSx.moveBtn}>
                                    {s}
                                  </Button>
                                ))}
                              </Box>
                              <Divider sx={{ my: 1, borderColor: "var(--border)" }} />
                              <Button fullWidth startIcon={<DeleteRoundedIcon fontSize="small" />} onClick={() => { setOpenMenuId(null); onDelete(job.id); }} sx={listViewSx.dangerMenuItem}>
                                Delete
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Paper>
            )}
          </Box>
        );
      })}

      {selectedCount > 0 && (
        <Paper sx={listViewSx.bulkBar}>
          <Box sx={listViewSx.bulkLeft}>
            <Typography sx={{ fontWeight: 900 }}>{selectedCount} Selected</Typography>
            <Button onClick={clearSelection} sx={listViewSx.ghostBtn}>
              Clear
            </Button>
          </Box>

          <Box sx={listViewSx.bulkRight}>
            <Box sx={{ position: "relative" }} ref={bulkMoveRef}>
              <Button onClick={() => setBulkMoveOpen((v) => !v)} startIcon={<SwapHorizRoundedIcon />} sx={listViewSx.ghostBtn}>
                Move To...
              </Button>
              {bulkMoveOpen && (
                <Box sx={listViewSx.bulkMoveMenu}>
                  {statuses.map((s) => (
                    <Button key={s} fullWidth onClick={() => { setBulkMoveOpen(false); bulkMove(s); }} sx={listViewSx.bulkMoveItem}>
                      {s}
                    </Button>
                  ))}
                </Box>
              )}
            </Box>

            <Button onClick={bulkDelete} startIcon={<DeleteRoundedIcon />} sx={listViewSx.bulkDangerBtn}>
              Delete
            </Button>

            <Button onClick={() => onExport?.(selectedJobs)} disabled={!onExport} sx={listViewSx.ghostBtn}>
              Export
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
