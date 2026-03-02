import { useState } from "react";
import { STATUSES } from "../constants/statuses";
import StatusColumn from "../components/StatusColumn/StatusColumn";
import { jobsMock } from "../data/jobsMock";
import AddJobModal from "../components/AddJobModal/AddJobModal";

export default function Dashboard() {
  const [jobs, setJobs] = useState(jobsMock);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const moveNext = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;

        const idx = STATUSES.indexOf(j.status);
        const nextStatus = STATUSES[Math.min(idx + 1, STATUSES.length - 1)];

        return {
          ...j,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const addJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
  };

  return (
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
    </div>
  );
}
