import { useMemo, useState } from "react";
import { STATUSES } from "../constants/statuses";
import StatusColumn from "../components/StatusColumn/StatusColumn";
import { jobsMock } from "../data/jobsMock";
import AddJobModal from "../components/AddJobModal/AddJobModal";
import { useToast } from "../components/Toast/ToastContext";
import JobDetailsDrawer from "../components/JobDetailsDrawer/JobDetailsDrawer"; // ✅ NEW
import "./dashboard.css";

export default function Dashboard({ searchQuery = "" }) {
  const [jobs, setJobs] = useState(jobsMock);
  const { addToast } = useToast();

  const [addOpen, setAddOpen] = useState(false);
  const [addStatus, setAddStatus] = useState(STATUSES[0]);

  // ✅ Drawer state
  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // remove Rejected
  const visibleStatuses = useMemo(
    () => STATUSES.filter((s) => s !== "Rejected"),
    [],
  );

  // filter by topbar searchQuery
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
    visibleStatuses.forEach((s) => (map[s] = []));
    filteredJobs.forEach((job) => {
      const status = job.status ?? visibleStatuses[0];
      if (!map[status]) map[status] = [];
      map[status].push(job);
    });
    return map;
  }, [filteredJobs, visibleStatuses]);

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
    addToast("success", "Success", `Deleted ${job?.companyName ?? "job"}`);

    // ✅ if you delete the open job, close drawer
    if (selectedJob?.id === jobId) {
      setDrawerOpen(false);
      setSelectedJob(null);
    }
  };

  const moveTo = (jobId, newStatus) => {
    const job = jobs.find((j) => j.id === jobId);

    if (!job) {
      addToast("error", "Error", "Job not found");
      return;
    }

    if (!newStatus || job.status === newStatus) {
      addToast("warning", "Warning", "Already in this column");
      return;
    }

    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: newStatus, updatedAt: new Date().toISOString() }
          : j,
      ),
    );

    addToast("success", "Success", `Moved to ${newStatus}`);

    // ✅ keep drawer in sync if this job is open
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) =>
        prev
          ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() }
          : prev,
      );
    }
  };

  const editJob = (job) => {
    alert(`Edit clicked for: ${job.jobTitle} @ ${job.companyName}`);
  };

  // ✅ OPEN drawer when card clicked
  const onSelectJob = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  return (
    <div className="dashboardPage">
      <div className="dashboardBoard">
        {visibleStatuses.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            jobs={jobsByStatus[status] ?? []}
            onDelete={deleteJob}
            onEdit={editJob}
            onMoveTo={moveTo}
            onAdd={() => {
              setAddStatus(status);
              setAddOpen(true);
            }}
            onSelect={onSelectJob} // ✅ NEW
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

      {/* ✅ Right details drawer */}
      <JobDetailsDrawer
        open={drawerOpen}
        job={selectedJob}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
