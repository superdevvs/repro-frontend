
import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useNavigate,
  useLocation
} from "react-router-dom";
import { useAuth } from './components/auth/AuthProvider';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { BookShoot } from './pages/BookShoot'; 
import { Shoots } from './pages/Shoots';
import { Clients } from './pages/Clients';
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
import ShootDetail from './pages/ShootDetail';
import Messages from './pages/Messages';
import { ShootHistory } from './pages/ShootHistory';
import VirtualTours from './pages/VirtualTours';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate, location]);
  
  return user ? <>{children}</> : null;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/book-shoot" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BookShoot />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/shoots" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Shoots />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/shoot-history" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ShootHistory />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/shoots/:shootId" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ShootDetail />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/clients" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Clients />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/accounts" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Accounts />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/invoices" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Invoices />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/availability" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Availability />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/messages" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/virtual-tours" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <VirtualTours />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Fallback - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
