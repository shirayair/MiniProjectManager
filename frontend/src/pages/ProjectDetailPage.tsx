// ✅ Updated ProjectDetailPage.tsx with FAB and styled description and only title + dueDate fields

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import {
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  Snackbar,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskTable, { Task } from '../components/TaskTable';
import AddTaskModal from '../components/AddTaskModal';

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tasks: Task[];
}

const ProjectDetailPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending'>('all');
  const [sortBy, setSortBy] = useState<'title' | 'dueDate'>('title');
  const [page, setPage] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const rowsPerPage = 5;

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get<Project>(`/projects/${projectId}`);
      setProject(res.data);
    } catch (err: any) {
      setSnackbarMessage('Failed to load project');
      setShowSnackbar(true);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newTaskTitle.trim()) return;
    try {
      await axiosInstance.post(`/projects/${projectId}/tasks`, {
        title: newTaskTitle,
        dueDate: newTaskDueDate || null,
      });
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setShowModal(false);
      fetchProject();
    } catch {
      setSnackbarMessage('Failed to add task');
      setShowSnackbar(true);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await axiosInstance.put(`/tasks/${task.id}`, {
        ...task,
        isCompleted: !task.isCompleted,
      });
      fetchProject();
    } catch {
      setSnackbarMessage('Failed to update task');
      setShowSnackbar(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      fetchProject();
    } catch {
      setSnackbarMessage('Failed to delete task');
      setShowSnackbar(true);
    }
  };

  if (!project) return <Typography>Loading...</Typography>;

  const filtered = project.tasks.filter(t =>
    filterStatus === 'all' ||
    (filterStatus === 'completed' && t.isCompleted) ||
    (filterStatus === 'pending' && !t.isCompleted)
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return (new Date(a.dueDate || '').getTime() || 0) - (new Date(b.dueDate || '').getTime() || 0);
  });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{project.title}</Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">Description:</Typography>
        <Typography variant="body1" sx={{ fontWeight: 400 }}>
          {project.description || ''}
        </Typography>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          select label="Filter" value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          SelectProps={{ native: true }} size="small"
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </TextField>
        <TextField
          select label="Sort" value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          SelectProps={{ native: true }} size="small"
        >
          <option value="title">Title</option>
          <option value="dueDate">Due Date</option>
        </TextField>
      </Box>

      <TaskTable
        tasks={sorted}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />

      <AddTaskModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTask}
        title={newTaskTitle}
        onTitleChange={setNewTaskTitle}
        dueDate={newTaskDueDate}
        onDueDateChange={setNewTaskDueDate}
      />

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setShowModal(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ProjectDetailPage;
