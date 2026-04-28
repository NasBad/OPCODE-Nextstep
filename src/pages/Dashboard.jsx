import { useMemo, useState } from "react";
import { Box } from "@mui/material";
import { STATUSES } from "../constants/statuses";
import AddJobModal from "../components/AddJobModal/AddJobModal";
import JobDetailsDrawer from "../components/JobDetailsDrawer/JobDetailsDrawer";
import { dashboardPageSx } from "./Dashboard.styles";
import DashboardHeader from "../features/dashboard/DashboardHeader";
import KanbanBoard from "../features/dashboard/KanbanBoard";
import ListView from "../features/dashboard/ListView";

export default function Dashboard({ searchQuery = "", jobs = [], onAdd, onDelete, onMoveTo, onEdit }) {
  const [viewMode, setViewMode] = useState("kanban");
  const [addOpen, setAddOpen] = useState(false);
  const [addStatus, setAddStatus] = useState(STATUSES[0]);

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [selectedJob, setSelectedJob] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const visibleStatuses = useMemo(
    () => STATUSES.filter((s) => s !== "Rejected"),
    [],
  );

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => {
      const tags = Array.isArray(j.tags) ? j.tags.join(" ") : "";
      const text = `${j.jobTitle} ${j.companyName} ${j.location ?? ""} ${j.workType ?? ""} ${tags}`.toLowerCase();
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

  const listJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      const da = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
      const db = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
      return db - da;
    });
  }, [filteredJobs]);

  const handleAdd = (newJob) => {
    onAdd({ ...newJob, status: addStatus, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  };

  const handleDelete = (jobId) => {
    onDelete(jobId);
    if (selectedJob?.id === jobId) {
      setDrawerOpen(false);
      setSelectedJob(null);
    }
  };

  const handleMoveTo = (jobId, newStatus) => {
    onMoveTo(jobId, newStatus);
    if (selectedJob?.id === jobId) {
      setSelectedJob((prev) => prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : prev);
    }
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setEditOpen(true);
  };

  const saveEdit = (updatedJob) => {
    onEdit(updatedJob);
    if (selectedJob?.id === updatedJob.id) setSelectedJob(updatedJob);
  };

  const onSelectJob = (job) => {
    setSelectedJob(job);
    setDrawerOpen(true);
  };

  return (
    <Box sx={dashboardPageSx.root}>
      <DashboardHeader viewMode={viewMode} onChangeView={setViewMode} />

      {viewMode === "kanban" ? (
        <KanbanBoard
          statuses={visibleStatuses}
          jobsByStatus={jobsByStatus}
          onDelete={handleDelete}
          onEdit={openEdit}
          onMoveTo={handleMoveTo}
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
          onMoveTo={handleMoveTo}
          onDelete={handleDelete}
          onSelect={onSelectJob}
          onEdit={openEdit}
        />
      )}

      {addOpen && (
        <AddJobModal
          open={addOpen}
          onClose={() => setAddOpen(false)}
          onAdd={handleAdd}
          defaultStatus={addStatus}
        />
      )}

      {editOpen && editingJob && (
        <AddJobModal
          open={editOpen}
          onClose={() => { setEditOpen(false); setEditingJob(null); }}
          onEdit={saveEdit}
          editJob={editingJob}
        />
      )}

      <JobDetailsDrawer
        open={drawerOpen}
        job={selectedJob}
        onClose={() => setDrawerOpen(false)}
      />
    </Box>
  );
}
