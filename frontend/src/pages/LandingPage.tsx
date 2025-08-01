// src/pages/LandingPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} style={{ padding: '3rem', textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Mini Project Manager 🚀
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Manage your projects and tasks.
        </Typography>

        <Box mt={4} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LandingPage;
