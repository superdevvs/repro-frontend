
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from './components/auth/AuthProvider';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BookShoot from './pages/BookShoot';
import Shoots from './pages/Shoots';
import Clients from './pages/Clients';
import Accounts from './pages/Accounts';
import Invoices from './pages/Invoices';
import Reports from './pages/Reports';
import Availability from './pages/Availability';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import ShootDetail from './pages/ShootDetail';
import Messages from './pages/Messages';
import ShootHistory from './pages/ShootHistory';
import VirtualTours from './pages/VirtualTours';
import ErrorBoundary from './components/ErrorBoundary';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  return user ? <>{children}</> : null;
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />
    },
    {
      path: "/verify-email/:token",
      element: <VerifyEmail />
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/book-shoot",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <BookShoot />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/shoots",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Shoots />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/shoot-history",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <ShootHistory />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/shoots/:shootId",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <ShootDetail />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/clients",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Clients />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/accounts",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Accounts />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/invoices",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Invoices />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/reports",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/availability",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Availability />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/messages",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Messages />
          </DashboardLayout>
        </ProtectedRoute>
      )
    },
    {
      path: "/virtual-tours",
      element: <DashboardLayout><VirtualTours /></DashboardLayout>
    }
  ]);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
          <Toaster />
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
