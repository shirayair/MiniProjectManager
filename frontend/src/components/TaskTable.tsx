// components/TaskTable.tsx
import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Checkbox, IconButton, TableContainer, Paper, TablePagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate: string | null;
}

interface TaskTableProps {
  tasks: Task[];
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  page,
  rowsPerPage,
  onPageChange,
  onToggle,
  onDelete,
}) => {
  const paginated = tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Done</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={task.isCompleted}
                    onChange={() => onToggle(task)}
                  />
                </TableCell>
                <TableCell sx={{ textDecoration: task.isCompleted ? 'line-through' : 'none' }}>
                  {task.title}
                </TableCell>
                <TableCell>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onDelete(task.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={tasks.length}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </>
  );
};

export default TaskTable;
