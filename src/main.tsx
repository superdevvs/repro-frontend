
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ShootsProvider } from './context/ShootsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShootsProvider>
        <App />
      </ShootsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
