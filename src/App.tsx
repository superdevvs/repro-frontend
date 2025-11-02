
import React from 'react'
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth";
import { PermissionsProvider } from './context/PermissionsContext';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Shoots from "./pages/Shoots";
import BookShoot from "./pages/BookShoot";
import Clients from "./pages/Clients";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import SchedulingSettings from "./pages/SchedulingSettings";
import Accounts from "./pages/Accounts";
import Availability from "./pages/Availability";
import Reports from "./pages/Reports";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import ShootHistory from "./pages/ShootHistory";
import PhotographerShootHistory from "./pages/PhotographerShootHistory";
import PhotographerAccount from "./pages/PhotographerAccount";
import PhotographerAvailability from "./pages/PhotographerAvailability";
import ShootDetails from "./pages/ShootDetails";
import { ShootsProvider } from './context/ShootsContext';
import Profile from "./pages/Profile";
import Accounting from "./pages/Accounting";
import Integrations from "./pages/Integrations";
import { toast } from "./components/ui/use-toast";
import Coupons from "./pages/Coupons";
import PermissionSettings from "./pages/PermissionSettings";
import DropboxCallback from './components/DropboxCallback';
import AddressLookupDemo from './components/AddressLookupDemo';
import ClientPortal from "./components/clients/ClientPortal";
import BookShootWithAddressLookup from './components/BookShootWithAddressLookup';
import AddressLookupTest from './pages/AddressLookupTest';
import TestClientPropertyForm from './pages/TestClientPropertyForm';
import { BrandedPage } from '@/components/tourLinks/BrandedPage';
import { MlsCompliant } from '@/components/tourLinks/MlsCompliant';
import { GenericMLS } from '@/components/tourLinks/GenericMLS';

// Create a new QueryClient instance
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
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state if auth is still initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show a toast notification when redirecting
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { role, isAuthenticated, isLoading } = useAuth();

  // Show loading state if auth is still initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast({
      title: "Authentication Required",
      description: "Please log in to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  if (!['admin', 'superadmin'].includes(role)) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Routes wrapper with auth provider
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Public test routes for address lookup */}
      <Route path="/test-address-lookup" element={<AddressLookupTest />} />
      <Route path="/test-client-form" element={<TestClientPropertyForm />} />

      <Route path="/dropbox-callback" element={<DropboxCallback />} />
      {/* Public client-facing tour pages (accept ?shootId=) */}
      <Route path="/tour/branded" element={<BrandedPage />} />
      <Route path="/tour/mls" element={<MlsCompliant />} />
      <Route path="/tour/generic-mls" element={<GenericMLS />} />
      <Route path="/client-portal" element={
        <ProtectedRoute>
          <ClientPortal />
        </ProtectedRoute>
      } />

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
      <Route path="/shoots/:id" element={
        <ProtectedRoute>
          <ShootDetails />
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
      <Route path="/accounting" element={
        <ProtectedRoute>
          <Accounting />
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
      <Route path="/scheduling-settings" element={
        <AdminRoute>
          <SchedulingSettings />
        </AdminRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/integrations" element={
        <ProtectedRoute>
          <Integrations />
        </ProtectedRoute>
      } />
      <Route path="/photographer-history" element={
        <ProtectedRoute>
          <PhotographerShootHistory />
        </ProtectedRoute>
      } />
      <Route path="/photographer-account" element={
        <ProtectedRoute>
          <PhotographerAccount />
        </ProtectedRoute>
      } />
      <Route path="/photographer-availability" element={
        <ProtectedRoute>
          <PhotographerAvailability />
        </ProtectedRoute>
      } />
      <Route path="/coupons" element={
        <ProtectedRoute>
          <Coupons />
        </ProtectedRoute>
      } />
      {/* New permissions settings route */}
      <Route path="/permissions" element={
        <ProtectedRoute>
          <PermissionSettings />
        </ProtectedRoute>
      } />
      {/* Address lookup testing routes */}
      <Route path="/address-lookup-demo" element={
        <ProtectedRoute>
          <AddressLookupDemo />
        </ProtectedRoute>
      } />
      <Route path="/book-shoot-enhanced" element={
        <ProtectedRoute>
          <BookShootWithAddressLookup />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton richColors />
          <BrowserRouter>
            <AuthProvider>
              <PermissionsProvider>
                <ShootsProvider>
                  <AppRoutes />
                </ShootsProvider>
              </PermissionsProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
