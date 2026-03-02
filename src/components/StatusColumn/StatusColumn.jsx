import JobCard from "../JobCard/JobCard";

export default function StatusColumn({
  status,
  jobs,
  onDelete,
  onEdit,
  onMoveTo,
  onAdd,
}) {
  const emptyText = getEmptyText(status);

  return (
    <div style={col}>
      {/* Header row */}
      <div style={colHeader}>
        <div>
          <h3 style={colTitle}>{status}</h3>
          <div style={colMeta}>{jobs.length} jobs</div>
        </div>

        <button
          onClick={onAdd}
          style={plusBtn}
          aria-label={`Add job to ${status}`}
          title={`Add to ${status}`}
        >
          +
        </button>
      </div>

      {/* Body */}
      <div style={list}>
        {jobs.length === 0 ? (
          <div style={emptyWrap}>
            <div style={emptyLabel}>
              <span style={{ fontWeight: 800 }}>✦</span> Empty State
            </div>

            <div style={emptyBox}>
              <div style={emptyIcon}>💬</div>
              <div style={emptyTitle}>{emptyText}</div>
              <div style={emptyHint}>Click + to add a job</div>
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
            />
          ))
        )}
      </div>
    </div>
  );
}

function getEmptyText(status) {
  // You can customize per column if you want
  if (status.toLowerCase().includes("interview")) {
    return "Drag Your First Interview Here!";
  }
  if (status.toLowerCase().includes("offer")) {
    return "Drop Your First Offer Here!";
  }
  if (status.toLowerCase().includes("reject")) {
    return "Nothing Rejected Yet!";
  }
  if (status.toLowerCase().includes("applied")) {
    return "Add Your First Application Here!";
  }
  return "Add Your First Job Here!";
}

/* ---------- styles ---------- */

const col = {
  minWidth: 280,
  maxWidth: 280,
  flex: "0 0 280px",
  background: "#ffffff",
  borderRadius: 14,
  padding: 12,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
};

const colHeader = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 10,
  marginBottom: 12,
};

const colTitle = { margin: 0, color: "#111", fontWeight: 900 };
const colMeta = { fontSize: 12, color: "#666", marginTop: 4 };

const plusBtn = {
  border: "1px solid #dbe6ff",
  background: "#f1f5ff",
  color: "#1a3a8a",
  width: 34,
  height: 34,
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 20,
  fontWeight: 900,
  lineHeight: "20px",
  display: "grid",
  placeItems: "center",
};

const list = {
  display: "grid",
  gap: 10,
  flex: 1,
};

const emptyWrap = {
  display: "grid",
  gap: 8,
};

const emptyLabel = {
  fontSize: 12,
  color: "#7b61ff",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const emptyBox = {
  border: "2px dashed #f2b24b",
  borderRadius: 14,
  padding: 16,
  background:
    "linear-gradient(135deg, rgba(255, 207, 123, 0.35), rgba(255, 255, 255, 1))",
  minHeight: 140,
  display: "grid",
  placeItems: "center",
  textAlign: "center",
};

const emptyIcon = {
  fontSize: 46,
  marginBottom: 6,
};

const emptyTitle = {
  fontSize: 18,
  fontWeight: 900,
  color: "#f0a100",
};

const emptyHint = {
  marginTop: 6,
  fontSize: 12,
  color: "#777",
};
