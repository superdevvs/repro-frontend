
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { 
  CameraIcon, 
  DollarSignIcon, 
  UsersIcon, 
  ImageIcon, 
  HomeIcon, 
  CheckIcon,
  HardDriveIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ShootData } from '@/types/shoots';
import { 
  getActiveShootsCount, 
  getTotalPaidAmount,
  getUniqueClientsCount,
  getTotalMediaAssetsCount,
  getScheduledTodayShoots,
  getCompletedShootsCount
} from '@/utils/dateUtils';
import { TimeRange } from '@/utils/dateUtils';

interface StatsCardGridProps {
  showRevenue: boolean;
  showClientStats: boolean;
  showPhotographerInterface: boolean;
  shoots: ShootData[];
  timeRange: TimeRange;
  isCompact?: boolean;
  className?: string;
}

export const StatsCardGrid: React.FC<StatsCardGridProps> = ({
  showRevenue,
  showClientStats,
  showPhotographerInterface,
  shoots,
  timeRange,
  isCompact = false,
  className = "",
}) => {
  // Calculate stats based on actual data
  const totalRevenue = getTotalPaidAmount(shoots);
  const activeShootsCount = getActiveShootsCount(shoots);
  const scheduledTodayCount = getScheduledTodayShoots(shoots).length;
  const totalClientsCount = getUniqueClientsCount(shoots);
  const mediaAssetsCount = getTotalMediaAssetsCount(shoots);
  const completedShoots = getCompletedShootsCount(shoots);

  const gridCols = isCompact 
    ? "grid-cols-2 sm:grid-cols-3 gap-2" 
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";
  
  return (
    <div className={`grid ${gridCols} ${className}`}>
      {showRevenue && (
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description={`For ${timeRange} period`}
          icon={<DollarSignIcon className="h-5 w-5" />}
          trend="up"
          trendValue="12%"
          delay={0}
          isCompact={isCompact}
        />
      )}
      
      <StatsCard
        title="Active Shoots"
        value={activeShootsCount.toString()}
        description={`${scheduledTodayCount} scheduled today`}
        icon={<CameraIcon className="h-5 w-5" />}
        trend="up"
        trendValue="4"
        delay={1}
        isCompact={isCompact}
      />
      
      {showClientStats && (
        <StatsCard
          title="Total Clients"
          value={totalClientsCount.toString()}
          description="Unique clients"
          icon={<UsersIcon className="h-5 w-5" />}
          trend="up"
          trendValue="9%"
          delay={2}
          isCompact={isCompact}
        />
      )}
      
      <StatsCard
        title="Media Assets"
        value={mediaAssetsCount.toString()}
        description="Total photos"
        icon={<ImageIcon className="h-5 w-5" />}
        trend="up"
        trendValue="22%"
        delay={3}
        isCompact={isCompact}
      />
      
      <StatsCard
        title="Completed Shoots"
        value={completedShoots.toString()}
        description="Finished projects"
        icon={<CheckIcon className="h-5 w-5" />}
        trend="up"
        trendValue="14%"
        delay={4}
        isCompact={isCompact}
      />
      
      <StatsCard
        title="Storage"
        value="12.4 GB"
        description="Dropbox, AWS S3"
        icon={<HardDriveIcon className="h-5 w-5" />}
        trend="up"
        trendValue="5%"
        delay={5}
        isCompact={isCompact}
      />
      
      {showPhotographerInterface && (
        <StatsCard
          title="Properties Shot"
          value={completedShoots.toString()}
          description="Completed shoots"
          icon={<HomeIcon className="h-5 w-5" />}
          trend="up"
          trendValue="14%"
          delay={6}
          isCompact={isCompact}
        />
      )}
    </div>
  );
};
