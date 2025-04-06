
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter';
import { TimeRange } from '@/utils/dateUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  // Get user name or username if available
  const userName = user?.name || 'there';
  
  // Get first letter for avatar fallback
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-3">
        <Avatar className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'} border-2 border-primary/20`}>
          <AvatarImage src={user?.avatar} alt={userName} />
          <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <Badge className={`mb-1 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 ${isMobile ? 'text-xs' : ''}`}>
            Dashboard
          </Badge>
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold`}>Welcome back, {userName}</h1>
          {!isMobile && (
            <p className="text-muted-foreground">
              {isAdmin ? (
                "Here's an overview of your business stats and scheduled shoots."
              ) : (
                "Here's what's happening with your shoots today."
              )}
            </p>
          )}
        </div>
      </div>
      
      <TimeRangeFilter 
        selectedRange={timeRange}
        onChange={onTimeRangeChange}
        className={`${isMobile ? 'w-full' : 'mt-1'}`}
      />
    </div>
  );
};
