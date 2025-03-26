
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { CalendarSection } from '@/components/dashboard/CalendarSection';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { role } = useAuth();
  const isMobile = useIsMobile();
  
  const calendarHeight = isMobile ? 300 : 400;
  
  const showRevenue = ['admin', 'superadmin'].includes(role);
  const showClientStats = ['admin', 'superadmin'].includes(role);
  const showPhotographerInterface = role === 'photographer';
  const showClientInterface = role === 'client';
  const isAdmin = ['admin', 'superadmin'].includes(role);
  
  return (
    <DashboardLayout>
      <div className="space-y-8 pb-6">
        <DashboardHeader isAdmin={isAdmin} />
        
        <StatsCardGrid
          showRevenue={showRevenue}
          showClientStats={showClientStats}
          showPhotographerInterface={showPhotographerInterface}
        />
        
        {showRevenue && <RevenueOverview />}
        
        <CalendarSection calendarHeight={calendarHeight} />
        
        {!showClientInterface && <TaskManager />}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
