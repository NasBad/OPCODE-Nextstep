import { Box } from "@mui/material";
import StatusColumn from "../../components/StatusColumn/StatusColumn";
import { kanbanBoardSx } from "./KanbanBoard.styles";

export default function KanbanBoard({ statuses, jobsByStatus, onDelete, onEdit, onMoveTo, onAdd, onSelect }) {
  return (
    <Box sx={kanbanBoardSx.board}>
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
    </Box>
  );
}
