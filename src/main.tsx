
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Theme initialization script
const initializeTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(systemTheme);
  } else {
    document.documentElement.classList.add(theme);
  }
  
  // Apply animation settings
  const animationsEnabled = localStorage.getItem('animations') !== 'false';
  if (!animationsEnabled) {
    document.documentElement.classList.add('reduce-motion');
  }
};

// Run theme initialization
initializeTheme();

// Create root with proper import from ReactDOM
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
