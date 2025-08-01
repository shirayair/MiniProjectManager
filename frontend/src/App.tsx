import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from './theme'; // 🎨 Custom MUI theme

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    // 🧠 Apply custom theme to the whole app
    <ThemeProvider theme={theme}>
      {/* 🧼 Normalize and apply base styles */}
      <CssBaseline />

      <Router>
        <Routes>
          {/* 🌐 Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 🔐 Protected routes */}
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <ProjectListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <ProjectDetailPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
