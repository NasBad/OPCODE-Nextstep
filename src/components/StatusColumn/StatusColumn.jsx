import JobCard from "../JobCard/JobCard";
import "./StatusColumn.css";
import useTheme from "../../hooks/useTheme";

export default function StatusColumn({
  status,
  jobs,
  onDelete,
  onEdit,
  onMoveTo,
  onAdd,
  onSelect,
}) {
  const { theme: mode } = useTheme();

  const emptyText = getEmptyText(status);
  const emptyTheme = getEmptyTheme(status, mode);
  const headerTheme = getHeaderTheme(status, mode);

  return (
    <div className="statusCol">
      {/* Header */}
      <div
        className="statusHeaderPill"
        style={{
          borderColor: headerTheme.color,
          color: headerTheme.color,
        }}
      >
        <span className="statusHeaderIcon">{headerTheme.icon}</span>

        <span className="statusHeaderTitle">{status}</span>

        <button
          type="button"
          onClick={onAdd}
          className="statusHeaderPlus"
          style={{ color: headerTheme.color }}
          aria-label={`Add job to ${status}`}
          title={`Add job to ${status}`}
        >
          +
        </button>
      </div>

      {/* Body */}
      <div className="statusList">
        {jobs.length === 0 ? (
          <div className="emptyWrap">
            <div className="emptyLabel" style={{ color: emptyTheme.border }}>
              <span className="emptyStar">✦</span> Empty State
            </div>

            <div
              className="emptyBox"
              style={{
                borderColor: emptyTheme.border,
                background: emptyTheme.gradient,
              }}
            >
              <div className="emptyIcon" style={{ color: emptyTheme.border }}>
                {emptyTheme.icon}
              </div>

              <div className="emptyTitle" style={{ color: emptyTheme.border }}>
                {emptyText}
              </div>

              <div className="emptyHint">Click + to add a job</div>
            </div>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={onDelete}
              onEdit={onEdit}
              onMoveTo={onMoveTo}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- Text ---------- */
function getEmptyText(status) {
  const s = status.toLowerCase();

  if (s.includes("interview")) return "Drag Your First Interview Here!";
  if (s.includes("offer")) return "Drop Your First Offer Here!";
  if (s.includes("applied")) return "Add Your First Application Here!";
  if (s.includes("wishlist")) return "Add Your First Job Here!";

  return "Add Your First Item Here!";
}

/* ---------- Header Theme ---------- */
function getHeaderTheme(status, mode) {
  const s = status.toLowerCase();
  const isDark = mode === "dark";

  const make = (color, icon) => ({
    color,
    icon,
    bg: isDark
      ? "transparent"
      : `color-mix(in srgb, ${color} 10%, var(--panel))`,
  });

  if (s.includes("wishlist")) return make("#7c3aed", "🔖");
  if (s.includes("applied")) return make("#ef4444", "✈️");
  if (s.includes("interview")) return make("#f59e0b", "💬");
  if (s.includes("offer")) return make("#10b981", "🏆");

  return make("#94a3b8", "📌");
}

/* ---------- Empty Theme ---------- */
function getEmptyTheme(status, mode) {
  const s = status.toLowerCase();
  const isDark = mode === "dark";

  if (s.includes("wishlist")) {
    return {
      border: "#7c3aed",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(124,58,237,0.22), rgba(255,255,255,1))",
      icon: "🔖",
    };
  }

  if (s.includes("applied")) {
    return {
      border: "#ef4444",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(239,68,68,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(239,68,68,0.22), rgba(255,255,255,1))",
      icon: "✈️",
    };
  }

  if (s.includes("interview")) {
    return {
      border: "#f59e0b",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(245,158,11,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(245,158,11,0.22), rgba(255,255,255,1))",
      icon: "💬",
    };
  }

  if (s.includes("offer")) {
    return {
      border: "#10b981",
      gradient: isDark
        ? "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(20,20,30,1))"
        : "linear-gradient(135deg, rgba(16,185,129,0.22), rgba(255,255,255,1))",
      icon: "🏆",
    };
  }

  return {
    border: "#94a3b8",
    gradient: isDark
      ? "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(20,20,30,1))"
      : "linear-gradient(135deg, rgba(148,163,184,0.16), rgba(255,255,255,1))",
    icon: "📌",
  };
}
