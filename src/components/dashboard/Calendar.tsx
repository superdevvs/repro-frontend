
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
import { ChevronLeft, ChevronRight, MapPinIcon, UserIcon, ClockIcon } from 'lucide-react';
import { ShootDetail } from './ShootDetail';

interface CalendarProps {
  className?: string;
  height?: number;
}

export function Calendar({ className, height = 400 }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { shoots } = useShoots();
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  // Show business hours (8am to 6pm)
  const hours = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => i + 8);
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

  const handleShowShootDetails = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsDetailOpen(true);
  };

  const handleCloseShootDetails = () => {
    setIsDetailOpen(false);
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={goToPreviousWeek} className="h-7 w-7 sm:h-8 sm:w-8">
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={goToNextWeek} className="h-7 w-7 sm:h-8 sm:w-8">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "text-center text-xs sm:text-sm py-1 font-medium",
              isToday(day) ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className="hidden xs:block">{format(day, 'EEE')}</div>
            <div className="xs:hidden">{format(day, 'EEEEE')}</div>
            <div className={cn(
              "text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mx-auto",
              isToday(day) ? "bg-primary text-primary-foreground" : ""
            )}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>
      
      <ScrollArea className={`h-[calc(100%-4rem)]`} style={{ height: `${height ? height - 64 : 336}px` }}>
        <div className="relative">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid gap-0.5 sm:gap-1 border-b border-border py-2 first:pt-0 last:border-none"
              style={{
                gridTemplateColumns: '40px repeat(7, minmax(0, 1fr))',
              }}
            >
              <div className="text-[10px] sm:text-xs text-muted-foreground text-right pr-1 sm:pr-2 font-medium">
                {`${hour}:00`}
              </div>
              {days.map((day, dayIndex) => {
                const eventsAtThisTime = events[hour - 8][dayIndex];
                if (eventsAtThisTime.length === 0) return <div key={day.toISOString()} className="h-12 sm:h-14 px-0.5 sm:px-1" />;
                
                return (
                  <div key={day.toISOString()} className="h-12 sm:h-14 px-0.5 sm:px-1 relative">
                    {eventsAtThisTime.map((event, idx) => {
                      // Extract and format the time from the scheduledDate
                      const shootTime = new Date(event.scheduledDate);
                      const formattedTime = format(shootTime, 'h:mm a');
                      
                      return (
                        <div
                          key={`${event.id}-${idx}`}
                          className="absolute top-0 left-0 right-0 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary p-1 sm:p-1.5 text-[8px] sm:text-xs h-full overflow-hidden border border-primary/20 cursor-pointer"
                          onClick={() => handleShowShootDetails(event)}
                        >
                          <Badge className="absolute top-1 right-1 rounded-full h-3 w-3 sm:h-4 sm:w-4 text-[6px] sm:text-[8px] p-0 flex items-center justify-center">
                            {event.status.charAt(0).toUpperCase()}
                          </Badge>
                          <p className="font-medium leading-tight truncate">{event.client.name}</p>
                          <div className="flex-col gap-0.5 mt-0.5 hidden sm:flex">
                            <div 
                              className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-primary cursor-pointer hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowShootDetails(event);
                              }}
                            >
                              <UserIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0" />
                              <span className="truncate">{event.photographer.name}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-muted-foreground">
                              <ClockIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0" />
                              <span>{formattedTime}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-[8px] sm:text-[9px] text-muted-foreground">
                              <MapPinIcon className="h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0" />
                              <span className="truncate">{event.location.city}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {/* Shoot Detail Dialog */}
      <ShootDetail 
        shoot={selectedShoot}
        isOpen={isDetailOpen}
        onClose={handleCloseShootDetails}
      />
    </div>
  );
}
