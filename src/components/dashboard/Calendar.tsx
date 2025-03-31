
import React, { useState, useMemo } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  getHours,
  isToday,
  isSameDay,
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useShoots } from '@/context/ShootsContext';
import { ShootData } from '@/types/shoots';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CalendarIcon, MapPinIcon } from 'lucide-react';

interface CalendarProps {
  className?: string;
  height?: number;
}

export function Calendar({ className, height = 400 }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { shoots } = useShoots();

  const weekStartsOn = 0; // Sunday
  const startDate = startOfWeek(currentDate, { weekStartsOn });
  
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  }, [startDate]);

  const goToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  // We'll only show a subset of hours to prevent overlap
  const hours = useMemo(() => {
    // Show business hours (8am to 8pm)
    return Array.from({ length: 13 }, (_, i) => i + 8);
  }, []);

  const events = useMemo(() => {
    const eventsForWeek = shoots.filter(shoot =>
      days.some(day => isSameDay(new Date(shoot.scheduledDate), day))
    );

    return hours.map(hour => {
      return days.map(day => {
        return eventsForWeek.filter(shoot => {
          const shootDate = new Date(shoot.scheduledDate);
          return isSameDay(shootDate, day) && getHours(shootDate) === hour;
        });
      });
    });
  }, [days, hours, shoots]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
      style={{ height: height }}
    >
      <Card className="glass-card h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <CardTitle>Calendar</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "text-center text-sm py-1",
                  isToday(day) ? "font-bold text-primary" : "text-muted-foreground"
                )}
              >
                <div>{format(day, 'EEE')}</div>
                <div className="text-xs">{format(day, 'MMM d')}</div>
              </div>
            ))}
          </div>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="relative">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid gap-1 border-b border-border py-2 first:pt-0 last:border-none"
                  style={{
                    gridTemplateColumns: '40px repeat(7, minmax(0, 1fr))',
                  }}
                >
                  <div className="text-xs text-muted-foreground text-right pr-2">
                    {`${hour}:00`}
                  </div>
                  {days.map((day, dayIndex) => {
                    const event = events[hour - 8][dayIndex][0];
                    if (!event) return <div key={day.toISOString()} className="h-10" />;
                    return (
                      <div
                        key={day.toISOString()}
                        className="relative rounded-md bg-primary/10 text-primary p-1 text-xs h-10 overflow-hidden"
                      >
                        <Badge className="absolute top-1 right-1 rounded-full h-4 w-4 text-[8px] p-0 flex items-center justify-center">
                          {event.status.charAt(0).toUpperCase()}
                        </Badge>
                        <p className="font-medium truncate">{event.client.name}</p>
                        <p className="text-muted-foreground flex items-center gap-1 truncate">
                          <MapPinIcon className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{event.location.fullAddress}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
