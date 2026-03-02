// src/App.jsx
import { useEffect, useState } from "react";
import AppShell from "./AppShell";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <AppShell
      searchValue={query}
      onSearchChange={setQuery}
      onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      theme={theme}
    >
      <Dashboard searchQuery={query} />
    </AppShell>
  );
}
