
import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { CalendarSection } from '@/components/dashboard/CalendarSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { shootsData } from '@/data/shootsData';
import { TimeRange, ShootData } from '@/types/shoots';

// Filter shoots by date range
const filterShootsByDateRange = (shoots: ShootData[], timeRange: TimeRange): ShootData[] => {
  const now = new Date();
  const startDate = new Date();
  
  switch (timeRange) {
    case 'today':
      // Today only
      return shoots.filter(shoot => {
        const shootDate = new Date(shoot.scheduledDate);
        return shootDate.toDateString() === now.toDateString();
      });
    case 'day':
      // Next 24 hours
      return shoots.filter(shoot => {
        const shootDate = new Date(shoot.scheduledDate);
        const diffTime = Math.abs(shootDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 1;
      });
    case 'week':
      // Next 7 days
      return shoots.filter(shoot => {
        const shootDate = new Date(shoot.scheduledDate);
        const diffTime = Math.abs(shootDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });
    case 'month':
      // Next 30 days
      return shoots.filter(shoot => {
        const shootDate = new Date(shoot.scheduledDate);
        const diffTime = Math.abs(shootDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      });
    case 'year':
      // This year
      return shoots.filter(shoot => {
        const shootDate = new Date(shoot.scheduledDate);
        return shootDate.getFullYear() === now.getFullYear();
      });
    case 'all':
    default:
      // All shoots
      return shoots;
  }
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [filteredShoots, setFilteredShoots] = useState(shootsData);

  useEffect(() => {
    setFilteredShoots(filterShootsByDateRange(shootsData, timeRange));
  }, [timeRange]);

  return (
    <Shell>
      <DashboardHeader 
        isAdmin={true} 
        timeRange={timeRange} 
        onTimeRangeChange={setTimeRange} 
      />
      
      <Tabs defaultValue="analytics" className="w-full mt-6">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-4">
          <StatsCardGrid 
            showRevenue={true}
            showClientStats={true}
            showPhotographerInterface={false}
            shoots={filteredShoots}
            timeRange={timeRange}
          />
          <UpcomingShoots 
            shoots={filteredShoots} 
            timeRange={timeRange}
          />
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4">
          <RevenueOverview 
            shoots={filteredShoots} 
            timeRange={timeRange} 
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <CalendarSection 
            shoots={filteredShoots}
            timeRange={timeRange}
          />
        </TabsContent>
      </Tabs>
    </Shell>
  );
};

export default Dashboard;
