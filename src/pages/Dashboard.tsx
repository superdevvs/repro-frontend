
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { CalendarSection } from '@/components/dashboard/CalendarSection';
import { useAuth } from '@/components/auth/AuthProvider';
import { useShoots } from '@/context/ShootsContext';
import { TimeRange } from '@/types/shoots';
import { filterShootsByDateRange } from '@/utils/dateUtils';

export default function Dashboard() {
  const { role } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const { shoots } = useShoots();
  
  const isAdmin = role === 'admin' || role === 'superadmin';
  const isClient = role === 'client';
  const isPhotographer = role === 'photographer';
  
  const filteredShoots = filterShootsByDateRange(shoots, timeRange);
  
  return (
    <div className="space-y-6 p-5 pb-16">
      <DashboardHeader 
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        isAdmin={isAdmin}
      />
      
      <StatsCardGrid 
        showRevenue={isAdmin || isClient} 
        showClientStats={isAdmin}
        showPhotographerInterface={isPhotographer}
        shoots={filteredShoots}
        timeRange={timeRange}
      />
      
      {(isAdmin || isClient) && (
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingShoots 
            shoots={filteredShoots} 
          />
          
          {isAdmin && (
            <RevenueOverview 
              shoots={filteredShoots} 
              timeRange={timeRange}
            />
          )}
        </div>
      )}
      
      <CalendarSection 
        calendarHeight={400} 
        shoots={filteredShoots}
      />
    </div>
  );
}
