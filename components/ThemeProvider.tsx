"use client";

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a dark theme instance.
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#111827', // This is a standard gray-900
      paper: '#1f2937',   // This is a standard gray-800 for surfaces
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b3b3b3', // Grey text for secondary info
    },
  },
});

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}