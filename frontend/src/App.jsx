import { useEffect, useState } from "react";
import AppShell from "./AppShell";
import Dashboard from "./pages/Dashboard";
import ArchivePage from "./pages/ArchivePage";
import { jobsMock } from "./data/jobsMock";
import { useToast } from "./components/Toast/toastStore";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState("dashboard");
  const [jobs, setJobs] = useState(jobsMock);
  const { addToast } = useToast();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const addJob = (newJob) => {
    setJobs((prev) => [newJob, ...prev]);
    addToast("success", "Success", `Added to ${newJob.status}`);
  };

  const deleteJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, isDeleted: true, updatedAt: new Date().toISOString() }
          : j,
      ),
    );
    addToast("success", "Archived", `${job?.companyName ?? "Job"} moved to Archive`);
  };

  const restoreJob = (jobId) => {
    const job = jobs.find((j) => j.id === jobId);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, isDeleted: false, updatedAt: new Date().toISOString() }
          : j,
      ),
    );
    addToast("success", "Restored", `${job?.companyName ?? "Job"} restored to board`);
  };

  const moveTo = (jobId, newStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) { addToast("error", "Error", "Job not found"); return; }
    if (job.status === newStatus) { addToast("warning", "Warning", "Already in this column"); return; }
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: newStatus, updatedAt: new Date().toISOString() }
          : j,
      ),
    );
    addToast("success", "Success", `Moved to ${newStatus}`);
  };

  const editJob = (updatedJob) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === updatedJob.id
          ? { ...updatedJob, updatedAt: new Date().toISOString() }
          : j,
      ),
    );
    addToast("success", "Success", "Job updated");
  };

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
