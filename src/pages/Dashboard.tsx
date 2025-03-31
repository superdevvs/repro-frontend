
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { useIsMobile } from '@/hooks/use-mobile';
import { useShoots } from '@/context/ShootsContext';
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter';
import { TimeRange, filterShootsByDateRange } from '@/utils/dateUtils';

const Dashboard = () => {
  const { role } = useAuth();
  const isMobile = useIsMobile();
  const { shoots } = useShoots();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  
  const showRevenue = ['admin', 'superadmin'].includes(role);
  const showClientStats = ['admin', 'superadmin'].includes(role);
  const showPhotographerInterface = role === 'photographer';
  const showClientInterface = role === 'client';
  const isAdmin = ['admin', 'superadmin'].includes(role);
  
  // Filter shoots based on selected time range
  const filteredShoots = filterShootsByDateRange(shoots, timeRange);
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-start sm:items-center mb-6">
          <DashboardHeader isAdmin={isAdmin} />
          <TimeRangeFilter 
            selectedRange={timeRange}
            onChange={handleTimeRangeChange}
            className="ml-auto"
          />
        </div>
        
        <StatsCardGrid
          showRevenue={showRevenue}
          showClientStats={showClientStats}
          showPhotographerInterface={showPhotographerInterface}
          shoots={filteredShoots}
          timeRange={timeRange}
        />
        
        {showRevenue && <RevenueOverview shoots={filteredShoots} timeRange={timeRange} />}
        
        {!showClientInterface && <TaskManager />}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
