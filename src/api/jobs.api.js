import client from "./client";

// Get all jobs for the logged-in user
export const getJobs = () => client.get("/jobs");

// Add a new job
export const addJob = (data) => client.post("/jobs", data);

// Edit a job (company, title, location, etc.)
export const updateJob = (id, data) => client.put(`/jobs/${id}`, data);

// Move a job to a new status
export const updateJobStatus = (id, status) =>
  client.patch(`/jobs/${id}/status`, { status });

// Archive (soft-delete) a job
export const deleteJob = (id) => client.delete(`/jobs/${id}`);

// Restore an archived job
export const restoreJob = (id) => client.patch(`/jobs/${id}/restore`);

// Get notes for a job
export const getNotes = (id) => client.get(`/jobs/${id}/notes`);

// Save notes for a job
export const saveNotes = (id, notes) =>
  client.patch(`/jobs/${id}/notes`, { notes });

// Download all jobs as Excel
export const exportJobs = () =>
  client.get("/jobs/export", { responseType: "blob" });
