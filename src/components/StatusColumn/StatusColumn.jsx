import JobCard from "../JobCard/JobCard";
import "./StatusColumn.css";

export default function StatusColumn({
  status,
  jobs,
  onDelete,
  onEdit,
  onMoveTo,
  onAdd,
  onSelect,
}) {
  const emptyText = getEmptyText(status);
  const theme = getEmptyTheme(status);

  return (
    <div className="statusCol">
      {/* Header row */}
      <div className="statusColHeader">
        <div>
          <h3 className="statusColTitle">{status}</h3>
          <div className="statusColMeta">{jobs.length} jobs</div>
        </div>

        <button
          onClick={onAdd}
          className="statusPlusBtn"
          style={{
            borderColor: theme.border,
            background: theme.lightBg,
            color: theme.border,
          }}
          aria-label={`Add job to ${status}`}
          title={`Add to ${status}`}
        >
          +
        </button>
      </div>

      {/* Body */}
      <div className="statusList">
        {jobs.length === 0 ? (
          <div className="emptyWrap">
            <div className="emptyLabel" style={{ color: theme.border }}>
              <span className="emptyStar">✦</span> Empty State
            </div>

            <div
              className="emptyBox"
              style={{
                borderColor: theme.border,
                background: theme.gradient,
              }}
            >
              <div className="emptyIcon" style={{ color: theme.border }}>
                {theme.icon}
              </div>

              <div className="emptyTitle" style={{ color: theme.border }}>
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

/* ---------- Empty State Text ---------- */
function getEmptyText(status) {
  const s = status.toLowerCase();

  if (s.includes("interview")) return "Drag Your First Interview Here!";
  if (s.includes("offer")) return "Drop Your First Offer Here!";
  if (s.includes("applied")) return "Add Your First Application Here!";
  if (s.includes("wishlist")) return "Add Your First Job Here!";

  return "Add Your First Item Here!";
}

/* ---------- Empty State Theme ---------- */
function getEmptyTheme(status) {
  const s = status.toLowerCase();

  if (s.includes("wishlist")) {
    return {
      border: "#7c3aed",
      lightBg: "#f3efff",
      gradient:
        "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(255,255,255,1))",
      icon: "🔖",
    };
  }

  if (s.includes("applied")) {
    return {
      border: "#ef4444",
      lightBg: "#fff1f2",
      gradient:
        "linear-gradient(135deg, rgba(239,68,68,0.25), rgba(255,255,255,1))",
      icon: "✈️",
    };
  }

  if (s.includes("interview")) {
    return {
      border: "#f59e0b",
      lightBg: "#fff8db",
      gradient:
        "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(255,255,255,1))",
      icon: "💬",
    };
  }

  if (s.includes("offer")) {
    return {
      border: "#10b981",
      lightBg: "#eafff2",
      gradient:
        "linear-gradient(135deg, rgba(16,185,129,0.25), rgba(255,255,255,1))",
      icon: "🏆",
    };
  }

  return {
    border: "#999",
    lightBg: "#f3f4f6",
    gradient:
      "linear-gradient(135deg, rgba(200,200,200,0.25), rgba(255,255,255,1))",
    icon: "📌",
  };
}
