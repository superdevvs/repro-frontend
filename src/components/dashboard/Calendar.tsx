
import React, { useState, useMemo } from 'react';
import {
  format,
  addDays,
  startOfWeek,
  getHours,
  getMinutes,
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
  height: number;
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

  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i);
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

  const visibleHours = useMemo(() => {
    const now = new Date();
    const currentHour = getHours(now);
    
    if (isToday(currentDate)) {
      return hours.filter(hour => hour >= currentHour - 2);
    }
    return hours;
  }, [currentDate, hours]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
      style={{ height }}
    >
      <Card className="glass-card">
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
                className="text-center text-sm text-muted-foreground"
              >
                {format(day, 'EEE')}
              </div>
            ))}
          </div>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="relative">
              {visibleHours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-1 gap-1 border-b border-border py-2 first:pt-0 last:border-none"
                  style={{
                    gridTemplateColumns: '40px repeat(7, minmax(0, 1fr))',
                  }}
                >
                  <div className="text-xs text-muted-foreground text-right">{`${hour}:00`}</div>
                  {days.map((day, dayIndex) => {
                    const event = events[hour][dayIndex][0];
                    if (!event) return <div key={day.toISOString()} />;
                    return (
                      <div
                        key={day.toISOString()}
                        className="relative rounded-md bg-primary/10 text-primary p-1 text-xs overflow-hidden"
                      >
                        <Badge className="absolute top-1 right-1 rounded-full h-5 w-5 text-xs">
                          {event.status}
                        </Badge>
                        <p className="font-medium">{event.client.name}</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {event.location.fullAddress}
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
