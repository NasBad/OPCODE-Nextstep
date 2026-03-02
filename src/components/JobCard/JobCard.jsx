export default function JobCard({ job, onMoveNext }) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 14,
        background: "#ffffff",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        marginTop: 12,
      }}
    >
      {/* Job Title */}
      <div
        style={{
          fontWeight: 700,
          fontSize: 15,
          color: "#111",
          marginBottom: 4,
        }}
      >
        {job.jobTitle}
      </div>

      {/* Company Name */}
      <div
        style={{
          fontSize: 13,
          color: "#555",
          marginBottom: 6,
        }}
      >
        {job.companyName}
      </div>

      {/* Location + Work Type */}
      <div
        style={{
          fontSize: 12,
          color: "#777",
          marginBottom: 10,
        }}
      >
        {job.location || "—"} • {job.workType || "—"}
      </div>

      {/* Tags */}
      {job.tags?.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {job.tags.slice(0, 5).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 20,
                backgroundColor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 500,
              }}
            >
              {t}
            </span>
          ))}
          <button
            onClick={() => onMoveNext(job.id)}
            style={{
              marginTop: 12,
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "green",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            Move Next →
          </button>
        </div>
      )}
    </div>
  );
}
