
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import { ServicesTab } from '@/components/scheduling/ServicesTab';

const SchedulingSettings = () => {
  const { role } = useAuth();
  
  // Only allow admin and superadmin to access this page
  if (!['admin', 'superadmin'].includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="space-y-2">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Settings
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Services</h1>
            <p className="text-muted-foreground">
              Manage services, pricing, and details
            </p>
          </div>
          
          <ServicesTab />
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default SchedulingSettings;
