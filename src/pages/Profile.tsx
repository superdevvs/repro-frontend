
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ClientProfile } from '@/components/profile/ClientProfile';
import { PhotographerProfile } from '@/components/profile/PhotographerProfile';
import { EditorProfile } from '@/components/profile/EditorProfile';
import { AdminProfile } from '@/components/profile/AdminProfile';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Log for debugging
    console.log('User role in Profile page:', user?.role);
  }, [user]);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Determine which profile component to render based on user role
  const renderProfileByRole = () => {
    switch (user?.role) {
      case 'client':
        return <ClientProfile />;
      case 'photographer':
        return <PhotographerProfile />;
      case 'editor':
        return <EditorProfile />;
      case 'admin':
      case 'superadmin':
        return <AdminProfile />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h1 className="text-2xl font-bold">Invalid Role</h1>
            <p className="text-muted-foreground mt-2">
              You don't have permission to access this page.
            </p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-8 max-w-6xl">
        {renderProfileByRole()}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
