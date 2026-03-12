import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import App from './App';
import './index.css';

// ─── MUI Custom Theme ────────────────────────────────────────
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f0f4f8' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        containedPrimary: { background: 'linear-gradient(135deg, #1976d2, #1565c0)', '&:hover': { background: 'linear-gradient(135deg, #1565c0, #0d47a1)' } },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' } },
    },
    MuiTextField: {
      styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
