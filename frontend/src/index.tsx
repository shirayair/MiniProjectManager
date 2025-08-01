import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import MUI ThemeProvider, createTheme, and CssBaseline
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a default MUI theme (you can customize this later)
const theme = createTheme({
  palette: {
    mode: 'light', // Change to 'dark' for dark mode
  },
});

// Create the root element and render the app wrapped in ThemeProvider
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {/* Wrap the entire app with ThemeProvider to apply MUI theming */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline applies a consistent baseline CSS across browsers */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// Optional: measure performance of your app
reportWebVitals();
