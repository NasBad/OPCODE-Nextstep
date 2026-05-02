import { useEffect, useState } from "react";
import AppShell from "./AppShell";
import Dashboard from "./pages/Dashboard";
import ArchivePage from "./pages/ArchivePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useToast } from "./components/Toast/toastStore";
import { useAuth } from "./context/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import * as jobsApi from "./api/jobs.api";

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();

  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState("dashboard");
  const [authPage, setAuthPage] = useState("login"); // "login" | "register"

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Load jobs from backend when user logs in
  useEffect(() => {
    if (!user) { setJobs([]); return; }
    setJobsLoading(true);
    jobsApi
      .getJobs()
      .then((res) => setJobs(res.data))
      .catch(() => addToast("error", "Error", "Failed to load jobs"))
      .finally(() => setJobsLoading(false));
  }, [user]);

  // --- Job handlers (call API, then update local state) ---

  const addJob = async (newJob) => {
    try {
      const res = await jobsApi.addJob(newJob);
      setJobs((prev) => [res.data, ...prev]);
      addToast("success", "Success", `Added to ${res.data.status}`);
    } catch {
      addToast("error", "Error", "Failed to add job");
    }
  };

  const deleteJob = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    try {
      await jobsApi.deleteJob(jobId);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, isDeleted: true, updatedAt: new Date().toISOString() }
            : j
        )
      );
      addToast("success", "Archived", `${job?.companyName ?? "Job"} moved to Archive`);
    } catch {
      addToast("error", "Error", "Failed to archive job");
    }
  };

  const restoreJob = async (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    try {
      await jobsApi.restoreJob(jobId);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, isDeleted: false, updatedAt: new Date().toISOString() }
            : j
        )
      );
      addToast("success", "Restored", `${job?.companyName ?? "Job"} restored to board`);
    } catch {
      addToast("error", "Error", "Failed to restore job");
    }
  };

  const moveTo = async (jobId, newStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) { addToast("error", "Error", "Job not found"); return; }
    if (job.status === newStatus) { addToast("warning", "Warning", "Already in this column"); return; }
    try {
      await jobsApi.updateJobStatus(jobId, newStatus);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, status: newStatus, updatedAt: new Date().toISOString() }
            : j
        )
      );
      addToast("success", "Success", `Moved to ${newStatus}`);
    } catch {
      addToast("error", "Error", "Failed to move job");
    }
  };

  const editJob = async (updatedJob) => {
    try {
      const res = await jobsApi.updateJob(updatedJob.id, updatedJob);
      setJobs((prev) =>
        prev.map((j) => (j.id === updatedJob.id ? res.data : j))
      );
      addToast("success", "Success", "Job updated");
    } catch {
      addToast("error", "Error", "Failed to update job");
    }
  };

  // --- Auth loading splash ---
  if (authLoading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  // --- Not logged in → show auth screens ---
  if (!user) {
    return authPage === "login" ? (
      <LoginPage onGoRegister={() => setAuthPage("register")} />
    ) : (
      <RegisterPage onGoLogin={() => setAuthPage("login")} />
    );
  }

  // --- Logged in → show app ---
  const activeJobs = jobs.filter((j) => !j.isDeleted);
  const archivedJobs = jobs.filter((j) => j.isDeleted || j.status === "Rejected");

  return (
    <AppShell
      searchValue={query}
      onSearchChange={setQuery}
      onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      theme={theme}
      currentPage={page}
      onNavigate={setPage}
    >
      {page === "dashboard" ? (
        <Dashboard
          searchQuery={query}
          jobs={activeJobs}
          loading={jobsLoading}
          onAdd={addJob}
          onDelete={deleteJob}
          onMoveTo={moveTo}
          onEdit={editJob}
        />
      ) : (
        <ArchivePage jobs={archivedJobs} onRestore={restoreJob} />
      )}
    </AppShell>
  );
}
