
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar } from '@/components/dashboard/Calendar';
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter';
import { TimeRange, filterShootsByDateRange } from '@/utils/dateUtils';
import { useShoots } from '@/context/ShootsContext';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { motion } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShootCalendar = () => {
  const { shoots } = useShoots();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const isMobile = useIsMobile();
  
  // Filter shoots based on selected time range
  const filteredShoots = filterShootsByDateRange(shoots, timeRange);
  
  // Calculate calendar height based on screen size
  const calendarHeight = isMobile ? 500 : 650;
  
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
          <TimeRangeFilter 
            selectedRange={timeRange}
            onChange={setTimeRange}
            className="mt-4 sm:mt-0 ml-auto"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-1">
            <UpcomingShoots />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3"
          >
            <Card className="glass-card h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <Calendar height={calendarHeight} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShootCalendar;
