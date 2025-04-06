
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
import ShootDetail from './ShootDetail'; // Fixed import

interface CalendarProps {
  className?: string;
  height?: number;
  shoots: ShootData[]; // Added to match the props passed
  onDateSelect?: (date: Date | undefined) => void; // Added to match the props passed
}

export function Calendar({ className, height = 400, shoots, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
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

  // Handle date selection for the parent component if provided
  const handleDayClick = (day: Date) => {
    if (onDateSelect) {
      onDateSelect(day);
    }
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{format(currentDate, 'MMMM yyyy')}</h3>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "text-center text-sm py-1 font-medium cursor-pointer",
              isToday(day) ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => handleDayClick(day)}
          >
            <div>{format(day, 'EEE')}</div>
            <div className={cn(
              "text-xs rounded-full w-6 h-6 flex items-center justify-center mx-auto",
              isToday(day) ? "bg-primary text-primary-foreground" : ""
            )}>
              {format(day, 'd')}
            </div>
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
                gridTemplateColumns: '50px repeat(7, minmax(0, 1fr))',
              }}
            >
              <div className="text-xs text-muted-foreground text-right pr-2 font-medium">
                {`${hour}:00`}
              </div>
              {days.map((day, dayIndex) => {
                const eventsAtThisTime = events[hour - 8][dayIndex];
                if (eventsAtThisTime.length === 0) return <div key={day.toISOString()} className="h-14 px-1" />;
                
                return (
                  <div key={day.toISOString()} className="h-14 px-1 relative">
                    {eventsAtThisTime.map((event, idx) => {
                      // Extract and format the time from the scheduledDate
                      const shootTime = new Date(event.scheduledDate);
                      const formattedTime = format(shootTime, 'h:mm a');
                      
                      return (
                        <div
                          key={`${event.id}-${idx}`}
                          className="absolute top-0 left-0 right-0 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors text-primary p-1.5 text-xs h-full overflow-hidden border border-primary/20 cursor-pointer"
                          onClick={() => handleShowShootDetails(event)}
                        >
                          <div className="flex items-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            <span>{formattedTime}</span>
                          </div>
                          <div className="font-medium truncate">
                            {event.location.address || 'No address'}
                          </div>
                          <div className="flex items-center text-xs text-primary/80 truncate">
                            <UserIcon className="h-3 w-3 mr-1" />
                            {event.client.name || 'No client'}
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
      
      {selectedShoot && isDetailOpen && (
        <ShootDetail 
          shoot={selectedShoot} 
          onClose={handleCloseShootDetails} 
        />
      )}
    </div>
  );
}
