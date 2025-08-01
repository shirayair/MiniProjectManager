import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  onTitleChange: (value: string) => void;
  dueDate: string;
  onDueDateChange: (value: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  onSubmit,
  title,
  onTitleChange,
  dueDate,
  onDueDateChange
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={onSubmit}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => onDueDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddTaskModal;
