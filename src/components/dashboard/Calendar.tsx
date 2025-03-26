import React, { useState, useMemo } from 'react';
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
  isSameMonth,
  parseISO,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon, 
  ClockIcon,
  UserIcon,
  PlusCircleIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { ShootData } from '@/types/shoots';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarProps {
  className?: string;
  events?: ShootData[];
  height?: number;
}

// Fallback to mock data if no events are provided
const mockEvents = [
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

type ViewType = 'day' | 'week' | 'month';

export function Calendar({ className, events = [], height = 400 }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');
  const { role } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Use provided events or fallback to mock data if empty
  const shootEvents = events.length > 0 
    ? events.map(shoot => ({
        id: shoot.id,
        title: shoot.location.fullAddress,
        startTime: new Date(shoot.scheduledDate),
        endTime: new Date(shoot.scheduledDate), // Add 2 hours in a real implementation
        photographer: shoot.photographer.name,
        client: shoot.client.name,
        status: shoot.status,
      }))
    : mockEvents;

  // Calculate days to display based on view type
  const daysToDisplay = useMemo(() => {
    if (viewType === 'day') {
      return [currentDate];
    } else if (viewType === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({
        start: weekStart,
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      });
    } else {
      // For month view, we'd implement a more complex logic
      // This is simplified for demonstration
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({
        start: weekStart,
        end: addDays(weekStart, 27), // Simplified 4-week month
      });
    }
  }, [currentDate, viewType]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const navigateToPreviousInterval = () => {
    if (viewType === 'day') {
      setCurrentDate((prev) => addDays(prev, -1));
    } else if (viewType === 'week') {
      setCurrentDate((prev) => subWeeks(prev, 1));
    } else {
      // Month view
      setCurrentDate((prev) => addDays(prev, -28)); // Simplified
    }
  };

  const navigateToNextInterval = () => {
    if (viewType === 'day') {
      setCurrentDate((prev) => addDays(prev, 1));
    } else if (viewType === 'week') {
      setCurrentDate((prev) => addWeeks(prev, 1));
    } else {
      // Month view
      setCurrentDate((prev) => addDays(prev, 28)); // Simplified
    }
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    const hourStart = addHours(startOfDay(date), hour);
    const hourEnd = addHours(startOfDay(date), hour + 1);

    return shootEvents.filter(event => {
      const eventStart = new Date(event.startTime);
      return (
        isSameDay(date, eventStart) &&
        eventStart.getHours() === hour
      );
    });
  };

  const handleAddShoot = () => {
    navigate('/book-shoot');
  };

  // Generate a header text based on view type
  const getHeaderText = () => {
    if (viewType === 'day') {
      return format(currentDate, 'MMMM d, yyyy');
    } else if (viewType === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const isSameMonthRange = isSameMonth(weekStart, weekEnd);
      
      return isSameMonthRange
        ? `${format(weekStart, 'MMMM yyyy')} · Week of ${format(weekStart, 'd')} - ${format(weekEnd, 'd')}`
        : `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      // Month view
      return format(currentDate, 'MMMM yyyy');
    }
  };

  // Calculate how many rows of hours to display based on the height
  const visibleHours = Math.min(6, hours.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("w-full", className)}
      style={{ height: height }}
    >
      <Card className="glass-card overflow-hidden h-full flex flex-col">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center border-b border-border pb-2 gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <CardTitle>Calendar</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToToday}
              className="h-8"
            >
              Today
            </Button>
            
            <Select 
              value={viewType}
              onValueChange={(value: ViewType) => setViewType(value)}
            >
              <SelectTrigger className="w-[110px] h-8">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={navigateToPreviousInterval}
                className="h-8 w-8"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={navigateToNextInterval}
                className="h-8 w-8"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm font-medium">
              {getHeaderText()}
            </div>
            
            {['admin', 'superadmin'].includes(role) && (
              <Button size="sm" onClick={handleAddShoot} className="ml-auto sm:ml-2">
                <PlusCircleIcon className="h-4 w-4 mr-1" />
                <span className={isMobile ? "hidden" : ""}>New Shoot</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto flex-1">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-8 gap-px">
              {/* Empty cell for time column */}
              <div className="h-8 p-2 border-b border-r border-border bg-muted/30" />
              
              {/* Day headers */}
              {daysToDisplay.map((day, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center h-8 p-2 border-b border-r border-border",
                    isToday(day) ? "bg-primary/5" : "bg-muted/30",
                    viewType === "month" && "col-span-1"
                  )}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground">
                      {format(day, 'EEE')}
                    </span>
                    <span className={cn(
                      "text-xs w-5 h-5 flex items-center justify-center rounded-full",
                      isToday(day) && "bg-primary text-primary-foreground"
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Time slots - only show first few hours for compact view */}
              {hours.slice(0, visibleHours).map((hour) => (
                <React.Fragment key={hour}>
                  {/* Time label */}
                  <div className="timeline-hour h-12 flex items-center justify-end pr-2 border-r border-b border-border text-xs text-muted-foreground sticky left-0 bg-background z-10">
                    {format(addHours(startOfDay(new Date()), hour), 'h a')}
                  </div>
                  
                  {/* Slots for each day */}
                  {daysToDisplay.map((day, dayIndex) => {
                    const eventsForSlot = getEventsForDateAndHour(day, hour);
                    const hasEvents = eventsForSlot.length > 0;
                    
                    return (
                      <div 
                        key={`${hour}-${dayIndex}`}
                        className={cn(
                          "timeline-slot h-12 relative border-b border-r border-border p-1",
                          hasEvents ? "bg-primary/5" : "bg-background",
                          isToday(day) && "bg-primary/5"
                        )}
                      >
                        {hasEvents ? (
                          eventsForSlot.map((event) => (
                            <TooltipProvider key={event.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="absolute inset-1 rounded-md bg-primary/20 border border-primary/30 p-1 hover:bg-primary/30 transition-colors cursor-pointer overflow-hidden">
                                    <div className="flex flex-col h-full">
                                      <span className="text-xs font-medium truncate">{event.title}</span>
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <ClockIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {format(event.startTime, 'h:mm a')}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="start">
                                  <div className="space-y-1">
                                    <p className="font-medium">{event.title}</p>
                                    <p className="text-xs flex items-center">
                                      <ClockIcon className="h-3 w-3 mr-1" />
                                      {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                                    </p>
                                    <p className="text-xs flex items-center">
                                      <UserIcon className="h-3 w-3 mr-1" />
                                      Photographer: {event.photographer}
                                    </p>
                                    <p className="text-xs">Client: {event.client}</p>
                                    <Badge 
                                      variant={
                                        event.status === 'completed' ? 'default' : 
                                        event.status === 'scheduled' ? 'secondary' : 
                                        event.status === 'pending' ? 'outline' : 'secondary'
                                      }
                                      className="mt-1 text-xs"
                                    >
                                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </Badge>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
