
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ShootsProvider } from './context/ShootsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ShootsProvider>
      <App />
    </ShootsProvider>
  </React.StrictMode>
);
