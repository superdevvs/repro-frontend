
import React from 'react';
import { Calendar } from '@/components/dashboard/Calendar';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';

interface CalendarSectionProps {
  calendarHeight: number;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ calendarHeight }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <UpcomingShoots />
      </div>
      
      <div className="lg:col-span-2">
        <Calendar height={calendarHeight} />
      </div>
    </div>
  );
};
