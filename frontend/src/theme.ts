// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f2f4f8', 
    },
    primary: {
      main: '#1976d2', // blue mui
    },
    secondary: {
      main: '#9c27b0', 
    },
    error: {
      main: '#e53935', 
    },
  },
  typography: {
    fontFamily: "'Rubik', 'Roboto', sans-serif",
    h4: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', 
    },
  },
  shape: {
    borderRadius: 12, 
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;
