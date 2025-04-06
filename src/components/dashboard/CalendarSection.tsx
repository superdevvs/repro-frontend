
import React from 'react';
import { Calendar } from '@/components/dashboard/Calendar';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { useIsMobile } from '@/hooks/use-mobile';
import { useShoots } from '@/context/ShootsContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CalendarSectionProps {
  calendarHeight?: number;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({ calendarHeight = 400 }) => {
  const isMobile = useIsMobile();
  const { shoots } = useShoots();
  
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
