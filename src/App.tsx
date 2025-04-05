
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth, UserMetadata } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Shoots from "./pages/Shoots";
import BookShoot from "./pages/BookShoot";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import Accounts from "./pages/Accounts";
import Availability from "./pages/Availability";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import ShootHistory from "./pages/ShootHistory";
import { ShootsProvider } from './context/ShootsContext';
import { ThemeProvider } from './hooks/useTheme';

// Declare global type augmentations for User to include metadata
declare module './components/auth/AuthProvider' {
  interface User {
    metadata?: UserMetadata;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Routes wrapper with auth provider
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/shoots" element={
        <ProtectedRoute>
          <Shoots />
        </ProtectedRoute>
      } />
      <Route path="/book-shoot" element={
        <ProtectedRoute>
          <BookShoot />
        </ProtectedRoute>
      } />
      <Route path="/shoot-history" element={
        <ProtectedRoute>
          <ShootHistory />
        </ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="/invoices" element={
        <ProtectedRoute>
          <Invoices />
        </ProtectedRoute>
      } />
      <Route path="/accounts" element={
        <ProtectedRoute>
          <Accounts />
        </ProtectedRoute>
      } />
      <Route path="/availability" element={
        <ProtectedRoute>
          <Availability />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton richColors />
          <BrowserRouter>
            <AuthProvider>
              <ShootsProvider>
                <AppRoutes />
              </ShootsProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
