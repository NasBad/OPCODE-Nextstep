import StatusColumn from "../../components/StatusColumn/StatusColumn";

export default function KanbanBoard({
  statuses,
  jobsByStatus,
  onDelete,
  onEdit,
  onMoveTo,
  onAdd,
  onSelect,
}) {
  return (
    <div className="dashboardBoard">
      {statuses.map((status) => (
        <StatusColumn
          key={status}
          status={status}
          jobs={jobsByStatus[status] ?? []}
          onDelete={onDelete}
          onEdit={onEdit}
          onMoveTo={onMoveTo}
          onAdd={() => onAdd(status)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
