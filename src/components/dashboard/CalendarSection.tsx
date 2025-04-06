
import React from 'react';
import { Calendar } from '@/components/dashboard/Calendar';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShootData } from '@/types/shoots';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CalendarSectionProps {
  calendarHeight?: number;
  shoots: ShootData[];
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ calendarHeight = 400, shoots }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
          <Calendar shoots={shoots} height={calendarHeight} />
        </div>
      </CardContent>
    </Card>
  );
};
