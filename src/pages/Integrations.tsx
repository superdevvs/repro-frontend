
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { IntegrationsHeader } from '@/components/integrations/IntegrationsHeader';
import { IntegrationsGrid } from '@/components/integrations/IntegrationsGrid';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Integrations = () => {
  const { role } = useAuth();
  
  // Only allow admin and superadmin to access this page
  if (!['admin', 'superadmin'].includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6 p-6">
          <IntegrationsHeader />
          <IntegrationsGrid />
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Integrations;
