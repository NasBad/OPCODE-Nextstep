import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppShell from "./AppShell";
import Dashboard from "./pages/Dashboard";
import ArchivePage from "./pages/ArchivePage";
import ResumePage from "./pages/ResumePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useToast } from "./components/Toast/toastStore";
import { jobsMock } from "./data/jobsMock";
import * as jobsApi from "./api/jobs.api";

// If no backend URL is set, use mock mode (GitHub Pages)
const MOCK_MODE = !import.meta.env.VITE_API_URL;

function PrivateRoute({ children }) {
  if (MOCK_MODE) return children;
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  if (MOCK_MODE) return <Navigate to="/dashboard" replace />;
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

// Mock mode layout — uses local state + jobsMock
function MockLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname === "/archive" ? "archive" : location.pathname === "/resume" ? "resume" : "dashboard";
  const { addToast } = useToast();
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState(jobsMock);

  const addJob    = (j) => { setJobs((p) => [{ ...j, id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...p]); addToast("success", "Success", `Added to ${j.status}`); };
  const deleteJob = (id) => { setJobs((p) => p.map((j) => j.id === id ? { ...j, isDeleted: true } : j)); addToast("success", "Archived", "Job moved to Archive"); };
  const restoreJob = (id) => { setJobs((p) => p.map((j) => j.id === id ? { ...j, isDeleted: false } : j)); addToast("success", "Restored", "Job restored"); };
  const moveTo    = (id, status) => { setJobs((p) => p.map((j) => j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j)); addToast("success", "Success", `Moved to ${status}`); };
  const editJob   = (u) => { setJobs((p) => p.map((j) => j.id === u.id ? { ...u, updatedAt: new Date().toISOString() } : j)); addToast("success", "Success", "Job updated"); };

  const activeJobs   = jobs.filter((j) => !j.isDeleted);
  const archivedJobs = jobs.filter((j) => j.isDeleted || j.status === "Rejected");

  return (
    <AppShell searchValue={query} onSearchChange={setQuery} currentPage={page} onNavigate={(p) => navigate(`/${p}`)}>
      {page === "dashboard" ? <Dashboard searchQuery={query} jobs={activeJobs} onAdd={addJob} onDelete={deleteJob} onMoveTo={moveTo} onEdit={editJob} />
        : page === "resume" ? <ResumePage jobs={jobs} />
        : <ArchivePage jobs={archivedJobs} onRestore={restoreJob} />}
    </AppShell>
  );
}

// Real mode layout — uses React Query + real backend
function MainLayout() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const page        = location.pathname === "/archive" ? "archive" : location.pathname === "/resume" ? "resume" : "dashboard";
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [query, setQuery] = useState("");

  const { data: jobs = [] } = useQuery({ queryKey: ["jobs"], queryFn: jobsApi.getJobs });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["jobs"] });

  const addJobMutation    = useMutation({ mutationFn: jobsApi.addJob,                                    onSuccess: (j) => { refresh(); addToast("success", "Success", `Added to ${j.status}`); }, onError: () => addToast("error", "Error", "Failed to add job") });
  const deleteJobMutation = useMutation({ mutationFn: jobsApi.deleteJob,                                 onSuccess: ()  => { refresh(); addToast("success", "Archived", "Job moved to Archive"); },  onError: () => addToast("error", "Error", "Failed to archive job") });
  const restoreMutation   = useMutation({ mutationFn: jobsApi.restoreJob,                                onSuccess: ()  => { refresh(); addToast("success", "Restored", "Job restored"); },           onError: () => addToast("error", "Error", "Failed to restore job") });
  const moveMutation      = useMutation({ mutationFn: ({ id, status }) => jobsApi.updateJobStatus(id, status), onSuccess: (j) => { refresh(); addToast("success", "Success", `Moved to ${j.status}`); }, onError: () => addToast("error", "Error", "Failed to move job") });
  const editMutation      = useMutation({ mutationFn: (j) => jobsApi.updateJob(j.id, j),                onSuccess: ()  => { refresh(); addToast("success", "Success", "Job updated"); },              onError: () => addToast("error", "Error", "Failed to update job") });

  const activeJobs   = jobs.filter((j) => !j.isDeleted);
  const archivedJobs = jobs.filter((j) => j.isDeleted || j.status === "Rejected");

  return (
    <AppShell searchValue={query} onSearchChange={setQuery} currentPage={page} onNavigate={(p) => navigate(`/${p}`)}>
      {page === "dashboard" ? <Dashboard searchQuery={query} jobs={activeJobs} onAdd={(j) => addJobMutation.mutate(j)} onDelete={(id) => deleteJobMutation.mutate(id)} onMoveTo={(id, status) => moveMutation.mutate({ id, status })} onEdit={(j) => editMutation.mutate(j)} />
        : page === "resume" ? <ResumePage jobs={jobs} />
        : <ArchivePage jobs={archivedJobs} onRestore={(id) => restoreMutation.mutate(id)} />}
    </AppShell>
  );
}

export default function App() {
  const Layout = MOCK_MODE ? MockLayout : MainLayout;
  return (
    <Routes>
      <Route path="/login"     element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"  element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>} />
      <Route path="/archive"   element={<PrivateRoute><Layout /></PrivateRoute>} />
      <Route path="/resume"    element={<PrivateRoute><Layout /></PrivateRoute>} />
      <Route path="*"          element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
