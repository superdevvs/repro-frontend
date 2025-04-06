
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ShootsProvider } from './context/ShootsContext';
import ErrorBoundary from './components/ErrorBoundary'; // Fixed import
import { AuthProvider } from './components/auth/AuthProvider';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
          <ShootsProvider>
            <Toaster />
            <App />
          </ShootsProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
