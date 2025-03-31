
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter';
import { TimeRange } from '@/utils/dateUtils';

interface DashboardHeaderProps {
  isAdmin: boolean;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  isAdmin, 
  timeRange, 
  onTimeRangeChange 
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
      <div>
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          Dashboard
        </Badge>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your shoots today.
        </p>
      </div>
      <TimeRangeFilter 
        selectedRange={timeRange}
        onChange={onTimeRangeChange}
        className="mt-4 sm:mt-0"
      />
    </div>
  );
};
