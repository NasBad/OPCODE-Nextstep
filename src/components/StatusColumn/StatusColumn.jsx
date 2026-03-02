import JobCard from "../JobCard/JobCard";

export default function StatusColumn({ status, jobs, onMoveNext }) {
  return (
    <div
      style={{
        minWidth: 260,
        background: "#ffffff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginTop: 0, color: "#111" }}>{status}</h3>
      <div style={{ fontSize: 12, color: "#666" }}>{jobs.length} jobs</div>

      <div>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onMoveNext={onMoveNext} />
        ))}
      </div>
    </div>
  );
}
