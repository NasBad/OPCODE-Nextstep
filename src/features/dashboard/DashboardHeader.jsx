export default function DashboardHeader({ viewMode, onToggleView }) {
  return (
    <div className="dashboardHeaderRow">
      <button
        type="button"
        className="viewToggleBtn"
        onClick={onToggleView}
        aria-label="Toggle Kanban/List view"
      >
        {viewMode === "kanban" ? "List View" : "Kanban View"}
      </button>
    </div>
  );
}
