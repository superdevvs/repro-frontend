import React, { useState, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useShoots } from '@/context/ShootsContext';
import { formatDateSafe, ensureDateString } from '@/utils/formatters';
import { filterShootsByDateRange, TimeRange } from '@/utils/dateUtils';

export function ShootCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const { shoots } = useShoots();

  const handleTimeRangeChange = useCallback((range: TimeRange) => {
    setTimeRange(range);
  }, []);

  const filteredShoots = filterShootsByDateRange(shoots, timeRange);

  const events = filteredShoots.map(event => ({
    title: `Shoot at ${event.location.city}`,
    date: new Date(ensureDateString(event.scheduledDate)),
  }));

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-6">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Shoot Calendar</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                // Add event indicators
                modifiers={{
                  scheduled: (date: Date) =>
                    events.some(event =>
                      event.date.getFullYear() === date.getFullYear() &&
                      event.date.getMonth() === date.getMonth() &&
                      event.date.getDate() === date.getDate()
                    ),
                }}
                modifiersClassNames={{
                  scheduled: "bg-secondary text-secondary-foreground",
                }}
              />
            </CardContent>
          </Card>

          {date && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {formatDateSafe(date, 'MMM dd, yyyy')} - Shoots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {events
                  .filter(event =>
                    event.date.getFullYear() === date.getFullYear() &&
                    event.date.getMonth() === date.getMonth() &&
                    event.date.getDate() === date.getDate()
                  )
                  .map((event, index) => (
                    <div key={index} className="py-2">
                      {/* Use the utility functions for date formatting */}
                      {event.title} - {formatDateSafe(event.date)}
                    </div>
                  ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
