
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
        <div className="h-full">
          <Calendar height={calendarHeight} />
        </div>
      </div>
      
      <div className="lg:col-span-5 space-y-4 flex flex-col">
        <div>
          <UpcomingShoots />
        </div>
        
        <div className="flex-1">
          <TaskManager />
        </div>
      </div>
    </div>
  );
};
