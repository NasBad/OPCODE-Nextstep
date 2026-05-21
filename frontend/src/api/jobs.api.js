import client from "./client";

// TODO: connect when backend jobs endpoints are ready (Tarek's task)

export const getJobs         = ()           => client.get("/jobs").then(r => r.data);
export const addJob          = (data)       => client.post("/jobs", data).then(r => r.data);
export const updateJob       = (id, data)   => client.put(`/jobs/${id}`, data).then(r => r.data);
export const updateJobStatus = (id, status) => client.patch(`/jobs/${id}/status`, { status }).then(r => r.data);
export const deleteJob       = (id)         => client.delete(`/jobs/${id}`).then(r => r.data);
export const restoreJob      = (id)         => client.patch(`/jobs/${id}/restore`).then(r => r.data);
export const saveNotes       = (id, notes)  => client.patch(`/jobs/${id}/notes`, { notes }).then(r => r.data);
