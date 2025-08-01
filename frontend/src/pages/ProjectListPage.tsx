import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Pagination,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProjectCard from '../components/ProjectCard';
import CreateProjectModal from '../components/CreateProjectModal';

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  taskCount?: number;
}

const LIMIT = 5;

const ProjectListPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const offset = (page - 1) * LIMIT;
      const response = await axiosInstance.get<Project[]>(`/projects?limit=${LIMIT}&offset=${offset}`);
      setProjects(response.data);
      setHasMore(response.data.length === LIMIT);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      setSnackbarMessage('Failed to load projects.');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;

    setIsCreating(true);
    try {
      await axiosInstance.post('/projects', { title, description });
      setTitle('');
      setDescription('');
      setShowModal(false);
      setPage(1);
      await fetchProjects();
    } catch (err: any) {
      console.error('Failed to create project:', err);
      setSnackbarMessage('Failed to create project.');
      setSnackbarOpen(true);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (isDeletingId === projectId) return;
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    setIsDeletingId(projectId);
    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      await fetchProjects();
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      setSnackbarMessage('Failed to delete project.');
      setSnackbarOpen(true);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 4,
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Your Projects</Typography>
        <Button onClick={logout} variant="outlined">
          Logout
        </Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            description={project.description}
            createdAt={project.createdAt}
            taskCount={project.taskCount}
            isDeleting={isDeletingId === project.id}
            onDelete={handleDeleteProject}
          />
        ))}
      </Box>

      {projects.length > 0 && (
        <Box mt={6} display="flex" justifyContent="center">
          <Pagination
            count={hasMore ? page + 1 : page}
            page={page}
            onChange={(_, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }}
        onClick={() => setShowModal(true)}
      >
        <AddIcon />
      </Fab>

      <CreateProjectModal
        open={showModal}
        title={title}
        description={description}
        isCreating={isCreating}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateProject}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectListPage;
