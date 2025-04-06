
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { CalendarSection } from '@/components/dashboard/CalendarSection';
import { useAuth } from '@/components/auth/AuthProvider';
import { useContext } from 'react';
import { ShootsContext } from '@/context/ShootsContext';
import { TimeRange } from '@/types/shoots';
import { eachDayOfInterval, isPast, isFuture, parseISO, subDays, addDays } from 'date-fns';

export default function Dashboard() {
  const { role } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const { shoots } = useContext(ShootsContext);
  
  const isAdmin = role === 'admin' || role === 'superadmin';
  const isClient = role === 'client';
  const isPhotographer = role === 'photographer';
  
  const filteredShoots = filterShootsByTimeRange(shoots, timeRange);
  
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
            timeRange={timeRange} 
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
        shoots={filteredShoots}
        timeRange={timeRange} 
      />
    </div>
  );
}

// Helper function to filter shoots by time range
function filterShootsByTimeRange(shoots, timeRange: TimeRange) {
  const today = new Date();
  const startDate = (() => {
    switch (timeRange) {
      case 'today': return today;
      case 'day': return today;
      case 'week': return subDays(today, 7);
      case 'month': return subDays(today, 30);
      case 'year': return subDays(today, 365);
      default: return new Date(0); // Beginning of time for 'all'
    }
  })();
  
  const endDate = (() => {
    switch (timeRange) {
      case 'today': return today;
      case 'day': return today;
      case 'week': return addDays(today, 7);
      case 'month': return addDays(today, 30);
      case 'year': return addDays(today, 365);
      default: return new Date(8640000000000000); // End of time for 'all'
    }
  })();
  
  return shoots.filter(shoot => {
    const shootDate = typeof shoot.scheduledDate === 'string' 
      ? parseISO(shoot.scheduledDate) 
      : shoot.scheduledDate;
      
    return shootDate >= startDate && shootDate <= endDate;
  });
}
