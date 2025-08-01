// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Paper
} from '@mui/material';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register({ username, password });
      localStorage.setItem('token', response.token);
      navigate('/projects');
    }catch (err: any) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Unexpected error');
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Register
            </Button>
          </Box>
        </form>
        {error && (
          <Box mt={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RegisterPage;
