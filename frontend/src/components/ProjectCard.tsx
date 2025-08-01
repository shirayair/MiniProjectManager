import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  taskCount?: number;
  isDeleting: boolean;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  description,
  createdAt,
  taskCount = 0,
  isDeleting,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: 300,
        transition: '0.3s',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Tooltip title={description || 'No description'} arrow placement="top">
        <CardContent onClick={() => navigate(`/projects/${id}`)}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="caption">
            Created at: {new Date(createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Tooltip>
      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button
          size="small"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={isDeleting}
          onClick={() => onDelete(id)}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
        {/* Updated text instead of Badge */}
        <Typography variant="caption" color="primary" fontWeight={500}>
          {taskCount} Tasks
        </Typography>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
