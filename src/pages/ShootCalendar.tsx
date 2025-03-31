
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar } from '@/components/ui/calendar';
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter';
import { TimeRange, filterShootsByDateRange } from '@/utils/dateUtils';
import { useShoots } from '@/context/ShootsContext';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { CalendarIcon, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format, addMonths, subMonths, isSameDay, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ShootCalendar = () => {
  const { shoots } = useShoots();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState("month");
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const isMobile = useIsMobile();
  
  // Filter shoots based on selected time range
  const filteredShoots = filterShootsByDateRange(shoots, timeRange);
  
  const goToPrevious = () => {
    if (viewType === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewType === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get array of dates that have shoots scheduled
  const getShootDays = () => {
    return shoots.map(shoot => parseISO(shoot.scheduledDate));
  };
  
  const shootDays = getShootDays();
  
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Calendar
            </Badge>
            <h1 className="text-3xl font-bold">Shoot Calendar</h1>
            <p className="text-muted-foreground">
              Track and manage your photography schedule.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
            <Select defaultValue={viewType} onValueChange={setViewType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
            <TimeRangeFilter 
              selectedRange={timeRange}
              onChange={setTimeRange}
            />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <div className="flex">
                  <Button variant="outline" size="icon" className="rounded-r-none" onClick={goToPrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-l-none" onClick={goToNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Tabs defaultValue="month" value={viewType} onValueChange={setViewType}>
                <div className="hidden">
                  <TabsList>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="month" className="p-4 min-h-[calc(100vh-20rem)]">
                  <Calendar 
                    mode="multiple"
                    selected={shootDays}
                    month={currentDate}
                    onMonthChange={setCurrentDate}
                    className="w-full"
                    modifiers={{
                      shoot: shootDays
                    }}
                    modifiersStyles={{
                      shoot: {
                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                        color: 'hsl(var(--primary))',
                        fontWeight: 'bold'
                      }
                    }}
                    components={{
                      DayContent: ({ date }) => {
                        // Find shoots for this day
                        const dayShootsList = shoots.filter(shoot => {
                          const shootDate = parseISO(shoot.scheduledDate);
                          return isSameDay(shootDate, date);
                        });

                        // Calculate the number of shoots for this day
                        const shootCount = dayShootsList.length;
                        
                        return (
                          <div className="flex flex-col items-center justify-center h-full">
                            <div>{date.getDate()}</div>
                            {shootCount > 0 && (
                              <div className="flex mt-1 flex-wrap justify-center">
                                {shootCount <= 3 ? (
                                  // Show avatars for each shoot (up to 3)
                                  dayShootsList.map((shoot, index) => (
                                    <div 
                                      key={index} 
                                      className="-mx-0.5"
                                      style={{ zIndex: 3 - index }}
                                    >
                                      <Avatar className="h-5 w-5 border border-background">
                                        <AvatarImage src={shoot.photographer.avatar} />
                                        <AvatarFallback className="text-[8px]">
                                          {shoot.photographer.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  ))
                                ) : (
                                  // Show count for more than 3 shoots
                                  <Badge className="text-xs h-5 bg-primary/20 text-primary border-primary/30">
                                    {shootCount} shoots
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="week" className="p-4 min-h-[calc(100vh-20rem)]">
                  <div className="flex flex-col items-center justify-center h-80">
                    <Grid3X3 className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Week View Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Weekly view is under development and will be available soon.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="day" className="p-4 min-h-[calc(100vh-20rem)]">
                  <div className="flex flex-col items-center justify-center h-80">
                    <Grid3X3 className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Day View Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">
                      Daily view is under development and will be available soon.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ShootCalendar;
