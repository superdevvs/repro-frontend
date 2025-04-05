import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Calendar } from '@/components/dashboard/Calendar';
import { ShootsFilter } from '@/components/dashboard/ShootsFilter';
import { Button } from '@/components/ui/button';
import { shootsData } from '@/data/shootsData';
import { filterShootsByDateRange } from '@/utils/dateUtils';
import { TimeRange } from '@/utils/dateUtils';

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
          <ShootsFilter onTimeRangeChange={handleTimeRangeChange} />
        </div>
      </div>

      <Calendar
        onDateSelect={handleDateSelect}
        shoots={filteredShoots}
      />
    </Shell>
  );
};

export default ShootCalendar;
