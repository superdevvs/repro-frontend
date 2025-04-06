
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Skeleton } from '@/components/ui/skeleton';

const InvoicesPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new accounting page
    navigate('/accounting', { replace: true });
  }, [navigate]);

  // Show a loading state while redirecting
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        
        <Skeleton className="h-96 w-full" />
      </div>
    </DashboardLayout>
  );
};

export default InvoicesPage;
