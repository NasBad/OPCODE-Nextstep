import { useEffect, useMemo, useRef, useState } from "react";

export default function ListView({
  jobs,
  statuses,
  onMoveTo,
  onDelete,
  onSelect, // opens drawer
  onEdit, // optional (you can pass editJob)
  onExport, // optional (selectedJobs) => ...
}) {
  // group by status
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

  // collapsible sections
  const [collapsed, setCollapsed] = useState(() => {
    const init = {};
    statuses.forEach((s) => (init[s] = false));
    return init;
  });

  // selected rows
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // close menus on outside click
  const [openMenuId, setOpenMenuId] = useState(null);
  const containerRef = useRef(null);

  // ✅ NEW: bulk move menu
  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const bulkMoveRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      // close kebab + bulk move when clicking outside
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenMenuId(null);
        setBulkMoveOpen(false);
        return;
      }

      // close bulk menu if click is outside it
      if (bulkMoveRef.current && !bulkMoveRef.current.contains(e.target)) {
        setBulkMoveOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // If jobs list changes, remove ids that no longer exist
  useEffect(() => {
    const ids = new Set(jobs.map((j) => j.id));
    setSelectedIds((prev) => {
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next;
    });
  }, [jobs]);

  const selectedCount = selectedIds.size;

  const selectedJobs = useMemo(() => {
    const idSet = selectedIds;
    return jobs.filter((j) => idSet.has(j.id));
  }, [jobs, selectedIds]);

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const isAllSelectedInSection = (status) => {
    const list = grouped[status] ?? [];
    if (!list.length) return false;
    return list.every((j) => selectedIds.has(j.id));
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
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="dashboardListView" ref={containerRef}>
      {statuses.map((status) => {
        const list = grouped[status] ?? [];
        const count = list.length;
        const isCollapsed = collapsed[status];

        return (
          <div
            className={`lvSection status-${status.toLowerCase().replace(" ", "")}`}
            key={status}
          >
            <button
              type="button"
              className="lvSectionHeader"
              onClick={() =>
                setCollapsed((p) => ({ ...p, [status]: !p[status] }))
              }
              aria-label={`Toggle ${status}`}
            >
              <span className={`lvChevron ${isCollapsed ? "isCollapsed" : ""}`}>
                ▾
              </span>
              <span
                className={`lvSectionTitle status-${status.toLowerCase().replace(" ", "")}`}
              >
                {status}
              </span>
              <span className="lvSectionCount">{count}</span>
            </button>

            {!isCollapsed && (
              <div className="lvTable">
                {count > 0 && (
                  <div className="lvRow lvHead">
                    <div className="lvCell check">
                      <input
                        type="checkbox"
                        checked={isAllSelectedInSection(status)}
                        onChange={() => toggleSelectAllInSection(status)}
                        aria-label={`Select all in ${status}`}
                      />
                    </div>
                    <div className="lvCell main">Job</div>
                    <div className="lvCell tags">Tags</div>
                    <div className="lvCell date">Date</div>
                    <div className="lvCell menu" />
                  </div>
                )}

                {count === 0 ? (
                  <div className="lvEmpty">No jobs here yet.</div>
                ) : (
                  list.map((job) => {
                    const checked = selectedIds.has(job.id);
                    const tags = Array.isArray(job.tags) ? job.tags : [];

                    return (
                      <div
                        key={job.id}
                        className={`lvRow ${checked ? "isSelected" : ""}`}
                        onClick={() => onSelect(job)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && onSelect(job)}
                      >
                        <div
                          className="lvCell check"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleRow(job.id)}
                            aria-label={`Select ${job.companyName}`}
                          />
                        </div>

                        <div className="lvCell main">
                          <div className="lvTitleRow">
                            <span className="lvCompany">{job.companyName}</span>
                            <span className="lvRole">{job.jobTitle}</span>
                            <span className="lvMeta">
                              {job.location ? `, ${job.location}` : ""}
                              {job.workType ? ` · ${job.workType}` : ""}
                            </span>
                          </div>
                        </div>

                        <div className="lvCell tags">
                          <div className="lvTagWrap">
                            {tags.slice(0, 6).map((t) => (
                              <span key={t} className="lvTag" data-tag={t}>
                                {t}
                              </span>
                            ))}
                            {tags.length > 6 && (
                              <span className="lvTag more">
                                +{tags.length - 6}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="lvCell date">
                          {formatDate(job.updatedAt ?? job.createdAt)}
                        </div>

                        <div
                          className="lvCell menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="lvKebab"
                            aria-label="Row actions"
                            onClick={() =>
                              setOpenMenuId((p) =>
                                p === job.id ? null : job.id,
                              )
                            }
                          >
                            ⋮
                          </button>

                          {openMenuId === job.id && (
                            <div className="lvMenu">
                              <button
                                type="button"
                                className="lvMenuItem"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onEdit?.(job);
                                }}
                              >
                                ✏️ Edit
                              </button>

                              <div className="lvMenuDivider" />

                              <div className="lvMenuLabel">Move to</div>
                              <div className="lvMoveGrid">
                                {statuses.map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    className="lvMoveBtn"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      onMoveTo(job.id, s);
                                    }}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>

                              <div className="lvMenuDivider" />

                              <button
                                type="button"
                                className="lvMenuItem danger"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onDelete(job.id);
                                }}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* ✅ Bulk Action Bar */}
      {selectedCount > 0 && (
        <div className="lvBulkBar">
          <div className="lvBulkLeft">
            <span className="lvBulkCount">{selectedCount} Selected</span>
            <button
              type="button"
              className="lvBulkGhost"
              onClick={clearSelection}
            >
              Clear
            </button>
          </div>

          <div className="lvBulkRight">
            {/* ✅ REPLACED: native <select> with themeable menu */}
            <div className="lvBulkMove" ref={bulkMoveRef}>
              <button
                type="button"
                className="lvBulkBtn"
                onClick={() => setBulkMoveOpen((v) => !v)}
              >
                Move To...
              </button>

              {bulkMoveOpen && (
                <div className="lvBulkMoveMenu">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="lvBulkMoveItem"
                      onClick={() => {
                        setBulkMoveOpen(false);
                        bulkMove(s);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="button" className="lvBulkDanger" onClick={bulkDelete}>
              Delete
            </button>

            <button
              type="button"
              className="lvBulkBtn"
              onClick={() => onExport?.(selectedJobs)}
              disabled={!onExport}
              title={
                !onExport ? "Hook up onExport to enable" : "Export selected"
              }
            >
              Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
