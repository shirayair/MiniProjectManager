import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';

interface CreateProjectModalProps {
  open: boolean;
  title: string;
  description: string;
  isCreating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChangeTitle: (val: string) => void;
  onChangeDescription: (val: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  open,
  title,
  description,
  isCreating,
  onClose,
  onSubmit,
  onChangeTitle,
  onChangeDescription,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateProjectModal;
