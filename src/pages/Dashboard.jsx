import { useMemo, useState } from "react";
import { STATUSES } from "../constants/statuses";
import StatusColumn from "../components/StatusColumn/StatusColumn";
import { jobsMock } from "../data/jobsMock";
import AddJobModal from "../components/AddJobModal/AddJobModal";
<<<<<<< HEAD
=======
import { useToast } from "../components/Toast/ToastContext";
>>>>>>> feature/kanban-board

export default function Dashboard({ searchQuery = "" }) {
  const [jobs, setJobs] = useState(jobsMock);
<<<<<<< HEAD
  const [isAddOpen, setIsAddOpen] = useState(false);

  const moveNext = (jobId) => {
=======
  const { addToast } = useToast();

  // Modal state
  const [addOpen, setAddOpen] = useState(false);
  const [addStatus, setAddStatus] = useState(STATUSES[0]);

  // ✅ Filter jobs by Topbar searchQuery
  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return jobs;

    return jobs.filter((j) => {
      const tags = Array.isArray(j.tags) ? j.tags.join(" ") : "";
      const text = `${j.jobTitle} ${j.companyName} ${j.location ?? ""} ${
        j.workType ?? ""
      } ${tags}`.toLowerCase();
      return text.includes(q);
    });
  }, [jobs, searchQuery]);

  const jobsByStatus = useMemo(() => {
    const map = {};
    STATUSES.forEach((s) => (map[s] = []));
    filteredJobs.forEach((job) => {
      const status = job.status ?? STATUSES[0];
      if (!map[status]) map[status] = [];
      map[status].push(job);
    });
    return map;
  }, [filteredJobs]);

  const addJob = (newJob) => {
    const jobWithStatus = {
      ...newJob,
      status: addStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setJobs((prev) => [jobWithStatus, ...prev]);
    addToast("success", "Success", `Added to ${addStatus}`);
  };

  const deleteJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    addToast("success", "Success", `Successfully deleted ${job?.companyName}`);
  };

  const moveTo = (jobId, newStatus) => {
    const job = jobs.find((j) => j.id === jobId);

    if (job?.status === newStatus) {
      addToast("error", "Error", "Job is already in this column");
      return;
    }

>>>>>>> feature/kanban-board
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: newStatus, updatedAt: new Date().toISOString() }
          : j,
      ),
    );

    addToast("success", "Success", `Moved to ${newStatus}`);
  };

  const editJob = (job) => {
    alert(`Edit clicked for: ${job.jobTitle} @ ${job.companyName}`);
  };

  const addJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  return (
<<<<<<< HEAD
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <button
          onClick={() => setIsAddOpen(true)}
          style={{
            border: "1px solid #1a73e8",
            background: "#1a73e8",
            color: "#fff",
            borderRadius: 10,
            padding: "10px 14px",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          + Add Job
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingTop: 12,
        }}
      >
        {STATUSES.map((status) => {
          const jobsForStatus = jobs.filter((j) => j.status === status);
          return (
            <StatusColumn
              key={status}
              status={status}
              jobs={jobsForStatus}
              onMoveNext={moveNext}
            />
          );
        })}
      </div>

      <AddJobModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addJob}
      />
=======
    <div style={page}>
      <div style={board}>
        {STATUSES.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            jobs={jobsByStatus[status]}
            onDelete={deleteJob}
            onEdit={editJob}
            onMoveTo={moveTo}
            onAdd={() => {
              setAddStatus(status);
              setAddOpen(true);
            }}
          />
        ))}
      </div>

      {addOpen && (
        <AddJobModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onAdd={addJob}
          defaultStatus={addStatus}
        />
      )}
>>>>>>> feature/kanban-board
    </div>
  );
}

/* ---------- styles ---------- */

const page = {
  width: "100%",
  boxSizing: "border-box",
};

const board = {
  width: "100%",
  display: "flex",
  gap: 16,
  overflowX: "auto",
  paddingBottom: 10,
  boxSizing: "border-box",
};
