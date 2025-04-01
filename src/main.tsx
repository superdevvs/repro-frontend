
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ShootsProvider } from '@/context/ShootsContext'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ShootsProvider>
        <App />
        <Toaster />
        <SonnerToaster position="top-right" />
      </ShootsProvider>
    </AuthProvider>
  </BrowserRouter>
);
