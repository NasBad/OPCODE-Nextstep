import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div
      style={{
        padding: 24,
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#111", marginBottom: 20 }}>NextStep</h1>
      <Dashboard />
    </div>
  );
}
