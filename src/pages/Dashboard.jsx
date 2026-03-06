// src/pages/Dashboard.jsx

import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { STATUSES } from "../constants/statuses";
import { jobsMock } from "../data/jobsMock";
import AddJobModal from "../components/AddJobModal/AddJobModal";
import { useToast } from "../components/Toast/toastStore";
import JobDetailsDrawer from "../components/JobDetailsDrawer/JobDetailsDrawer";
import { dashboardPageSx } from "./Dashboard.styles";

// ✅ NEW (separated views)
import DashboardHeader from "../features/dashboard/DashboardHeader";
import KanbanBoard from "../features/dashboard/KanbanBoard";
import ListView from "../features/dashboard/ListView";

export default function Dashboard({ searchQuery = "" }) {
  const [jobs, setJobs] = useState(jobsMock);
  const { addToast } = useToast();

  // ✅ NEW: view mode
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" | "list"

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

  // ✅ list view sorting (latest updated first)
  const listJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      const da = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return db - da;
    });
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

  const editJob = () => {
    addToast("warning", "Warning", "Feature Not Ready Yet");
  };

  // ✅ OPEN drawer when card clicked
  const onSelectJob = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  return (
    <Box sx={dashboardPageSx.root}>
      <DashboardHeader
        viewMode={viewMode}
        onChangeView={setViewMode}
      />

      {viewMode === "kanban" ? (
        <KanbanBoard
          statuses={visibleStatuses}
          jobsByStatus={jobsByStatus}
          onDelete={deleteJob}
          onEdit={editJob}
          onMoveTo={moveTo}
          onAdd={(status) => {
            setAddStatus(status);
            setAddOpen(true);
          }}
          onSelect={onSelectJob}
        />
      ) : (
        <ListView
          jobs={listJobs}
          statuses={visibleStatuses}
          onMoveTo={moveTo}
          onDelete={deleteJob}
          onSelect={onSelectJob}
          onEdit={editJob}
        />
      )}

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
    </Box>
  );
}
