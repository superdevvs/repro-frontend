
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ShootsProvider } from '@/context/ShootsContext'
import { ThemeProvider } from '@/hooks/useTheme'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <ShootsProvider>
          <App />
          <Toaster />
          <SonnerToaster />
        </ShootsProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);
