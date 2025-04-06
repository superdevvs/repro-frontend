
import React from 'react';
import { Calendar } from '@/components/dashboard/Calendar';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { useIsMobile } from '@/hooks/use-mobile';
import { TaskManager } from './TaskManager';

interface CalendarSectionProps {
  calendarHeight: number;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ calendarHeight }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-7">
        <Calendar height={calendarHeight} />
      </div>
      
      <div className="lg:col-span-5 space-y-4">
        <UpcomingShoots />
        
        <div className="h-[calc(100%-220px)] min-h-[300px]">
          <TaskManager />
        </div>
      </div>
    </div>
  );
};
