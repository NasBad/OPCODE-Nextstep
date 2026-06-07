import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AppShell from "./AppShell";
import Dashboard from "./pages/Dashboard";
import ArchivePage from "./pages/ArchivePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useToast } from "./components/Toast/toastStore";
import * as jobsApi from "./api/jobs.api";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function MainLayout() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const page          = location.pathname === "/archive" ? "archive" : "dashboard";
  const queryClient   = useQueryClient();
  const { addToast }  = useToast();
  const [query, setQuery] = useState("");

  // Fetch all jobs from backend
  const { data: jobs = [] } = useQuery({
    queryKey: ["jobs"],
    queryFn: jobsApi.getJobs,
  });

  // Helper to refresh jobs list after any change
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["jobs"] });

  const addJobMutation = useMutation({
    mutationFn: jobsApi.addJob,
    onSuccess: (job) => { refresh(); addToast("success", "Success", `Added to ${job.status}`); },
    onError: () => addToast("error", "Error", "Failed to add job"),
  });

  const deleteJobMutation = useMutation({
    mutationFn: jobsApi.deleteJob,
    onSuccess: () => { refresh(); addToast("success", "Archived", "Job moved to Archive"); },
    onError: () => addToast("error", "Error", "Failed to archive job"),
  });

  const restoreJobMutation = useMutation({
    mutationFn: jobsApi.restoreJob,
    onSuccess: () => { refresh(); addToast("success", "Restored", "Job restored to board"); },
    onError: () => addToast("error", "Error", "Failed to restore job"),
  });

  const moveToMutation = useMutation({
    mutationFn: ({ id, status }) => jobsApi.updateJobStatus(id, status),
    onSuccess: (job) => { refresh(); addToast("success", "Success", `Moved to ${job.status}`); },
    onError: () => addToast("error", "Error", "Failed to move job"),
  });

  const editJobMutation = useMutation({
    mutationFn: (job) => jobsApi.updateJob(job.id, job),
    onSuccess: () => { refresh(); addToast("success", "Success", "Job updated"); },
    onError: () => addToast("error", "Error", "Failed to update job"),
  });

  const activeJobs   = jobs.filter((j) => !j.isDeleted);
  const archivedJobs = jobs.filter((j) => j.isDeleted || j.status === "Rejected");

  return (
    <AppShell
      searchValue={query}
      onSearchChange={setQuery}
      currentPage={page}
      onNavigate={(p) => navigate(`/${p}`)}
    >
      {page === "dashboard" ? (
        <Dashboard
          searchQuery={query}
          jobs={activeJobs}
          onAdd={(job) => addJobMutation.mutate(job)}
          onDelete={(id) => deleteJobMutation.mutate(id)}
          onMoveTo={(id, status) => moveToMutation.mutate({ id, status })}
          onEdit={(job) => editJobMutation.mutate(job)}
        />
      ) : (
        <ArchivePage
          jobs={archivedJobs}
          onRestore={(id) => restoreJobMutation.mutate(id)}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"     element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"  element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><MainLayout /></PrivateRoute>} />
      <Route path="/archive"   element={<PrivateRoute><MainLayout /></PrivateRoute>} />
      <Route path="*"          element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
