import { useState } from "react";
import { STATUSES } from "../constants/statuses";
import StatusColumn from "../components/StatusColumn/StatusColumn";
import { jobsMock } from "../data/jobsMock";

export default function Dashboard() {
  const [jobs, setJobs] = useState(jobsMock);
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

  return (
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
  );
}
