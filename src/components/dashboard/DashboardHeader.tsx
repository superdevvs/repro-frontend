
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter';
import { TimeRange } from '@/utils/dateUtils';
import { useAuth } from '@/components/auth/AuthProvider';

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
  const { user } = useAuth();

  // Get user name or username if available
  const userName = user?.name || 'there';

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-6">
      <div className="pl-7">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-3 py-0.5">
          Dashboard
        </Badge>
        <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin 
            ? "Here's an overview of your business stats and scheduled shoots." 
            : "Here's what's happening with your shoots today."
          }
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
