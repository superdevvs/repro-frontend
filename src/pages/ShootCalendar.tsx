
import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Calendar } from '@/components/dashboard/Calendar';
import { ShootsFilter } from '@/components/dashboard/ShootsFilter';
import { Button } from '@/components/ui/button';
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

const ShootCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [filteredShoots, setFilteredShoots] = useState(shootsData);

  useEffect(() => {
    setFilteredShoots(filterShootsByDateRange(shootsData, timeRange));
  }, [timeRange]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null);
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <Shell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Shoot Calendar</h1>
        <p className="text-muted-foreground">View and manage your scheduled shoots.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline">Add Shoot</Button>
          <ShootsFilter 
            selectedRange={timeRange}
            onChange={handleTimeRangeChange} 
          />
        </div>
      </div>

      <Calendar
        shoots={filteredShoots}
        className="w-full"
        onDateSelect={handleDateSelect}
      />
    </Shell>
  );
};

export default ShootCalendar;
