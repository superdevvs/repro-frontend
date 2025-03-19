
import React, { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addDays,
  addWeeks,
  subWeeks,
  isToday,
  startOfDay,
  addHours,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface CalendarProps {
  className?: string;
}

// Mock data for events
const events = [
  {
    id: '1',
    title: '123 Main St Shoot',
    startTime: addHours(startOfDay(new Date()), 10),
    endTime: addHours(startOfDay(new Date()), 12),
    photographer: 'John Doe',
    client: 'ABC Properties',
    status: 'scheduled',
  },
  {
    id: '2',
    title: '456 Park Ave Shoot',
    startTime: addHours(addDays(startOfDay(new Date()), 1), 14),
    endTime: addHours(addDays(startOfDay(new Date()), 1), 16),
    photographer: 'Jane Smith',
    client: 'XYZ Realty',
    status: 'scheduled',
  },
  {
    id: '3',
    title: '789 Ocean Dr Shoot',
    startTime: addHours(addDays(startOfDay(new Date()), 2), 11),
    endTime: addHours(addDays(startOfDay(new Date()), 2), 13),
    photographer: 'John Doe',
    client: 'Coastal Properties',
    status: 'scheduled',
  },
];

export function Calendar({ className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  
  const weekDays = eachDayOfInterval({
    start: weekStartDate,
    end: endOfWeek(weekStartDate, { weekStartsOn: 1 }),
  });

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const navigateToPreviousWeek = () => {
    setWeekStartDate((prev) => subWeeks(prev, 1));
  };

  const navigateToNextWeek = () => {
    setWeekStartDate((prev) => addWeeks(prev, 1));
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setWeekStartDate(startOfWeek(today, { weekStartsOn: 1 }));
  };

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    const hourStart = addHours(startOfDay(date), hour);
    const hourEnd = addHours(startOfDay(date), hour + 1);

    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      return (
        isSameDay(date, eventStart) &&
        eventStart.getHours() === hour
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
    >
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <CardTitle>Calendar</CardTitle>
          </div>
          <div className="flex items-center ml-auto gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToToday}
              className="h-8"
            >
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={navigateToPreviousWeek}
                className="h-8 w-8"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={navigateToNextWeek}
                className="h-8 w-8"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm font-medium">
              {format(weekStartDate, 'MMM d')} - {format(endOfWeek(weekStartDate, { weekStartsOn: 1 }), 'MMM d, yyyy')}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-8 gap-1">
            {/* Empty cell for time column */}
            <div className="h-10" />
            
            {/* Day headers */}
            {weekDays.map((day, i) => (
              <div 
                key={i}
                className={cn(
                  "flex flex-col items-center justify-center h-10",
                  isToday(day) && "text-primary font-medium"
                )}
              >
                <span className="text-sm">{format(day, 'EEE')}</span>
                <span className={cn(
                  "text-sm rounded-full w-6 h-6 flex items-center justify-center",
                  isToday(day) && "bg-primary text-primary-foreground"
                )}>
                  {format(day, 'd')}
                </span>
              </div>
            ))}
            
            {/* Time slots */}
            {hours.map((hour) => (
              <React.Fragment key={hour}>
                {/* Time label */}
                <div className="timeline-hour h-20 flex items-center">
                  {format(addHours(startOfDay(new Date()), hour), 'h a')}
                </div>
                
                {/* Slots for each day */}
                {weekDays.map((day, dayIndex) => {
                  const eventsForSlot = getEventsForDateAndHour(day, hour);
                  const hasEvents = eventsForSlot.length > 0;
                  
                  return (
                    <div 
                      key={`${hour}-${dayIndex}`}
                      className={cn(
                        "timeline-slot h-20 relative",
                        hasEvents && "timeline-slot-booked"
                      )}
                    >
                      {hasEvents && eventsForSlot.map((event) => (
                        <TooltipProvider key={event.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="absolute inset-1 rounded bg-primary/20 border border-primary/30 p-2 hover:bg-primary/30 transition-colors">
                                <div className="flex flex-col h-full">
                                  <span className="text-xs font-medium truncate">{event.title}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                                  </span>
                                  <div className="mt-auto flex items-center justify-between">
                                    <Badge variant="outline" className="text-[10px] h-4 px-1">
                                      {event.photographer}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p className="font-medium">{event.title}</p>
                                <p className="text-xs">{format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}</p>
                                <p className="text-xs">Photographer: {event.photographer}</p>
                                <p className="text-xs">Client: {event.client}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
