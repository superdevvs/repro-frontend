
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CameraIcon, DollarSignIcon, UsersIcon, ImageIcon, HomeIcon, ReceiptIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShootData } from '@/types/shoots';
import { 
  getActiveShootsCount, 
  getTotalPaidAmount,
  getUniqueClientsCount,
  getTotalMediaAssetsCount,
  getScheduledTodayShoots,
  getEstimatedTaxAmount
} from '@/utils/dateUtils';

interface StatsCardGridProps {
  showRevenue: boolean;
  showClientStats: boolean;
  showPhotographerInterface: boolean;
  shoots: ShootData[];
}

export const StatsCardGrid: React.FC<StatsCardGridProps> = ({
  showRevenue,
  showClientStats,
  showPhotographerInterface,
  shoots,
}) => {
  // Calculate stats based on actual data
  const totalRevenue = getTotalPaidAmount(shoots);
  const activeShootsCount = getActiveShootsCount(shoots);
  const scheduledTodayCount = getScheduledTodayShoots(shoots).length;
  const totalClientsCount = getUniqueClientsCount(shoots);
  const mediaAssetsCount = getTotalMediaAssetsCount(shoots);
  const estimatedTax = getEstimatedTaxAmount(shoots);
  
  // Calculate the properties shot for photographers
  const completedShoots = shoots.filter(shoot => shoot.status === 'completed').length;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {showRevenue && (
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="From paid shoots"
          icon={<DollarSignIcon className="h-5 w-5" />}
          trend="up"
          trendValue="12%"
          delay={0}
        />
      )}
      
      {showRevenue && (
        <StatsCard
          title="Estimated Tax"
          value={`$${estimatedTax.toLocaleString()}`}
          description="Based on current revenue (15%)"
          icon={<ReceiptIcon className="h-5 w-5" />}
          trend="up"
          trendValue="12%"
          delay={1}
        />
      )}
      
      <StatsCard
        title="Active Shoots"
        value={activeShootsCount.toString()}
        description={`${scheduledTodayCount} scheduled today`}
        icon={<CameraIcon className="h-5 w-5" />}
        trend="up"
        trendValue="4"
        delay={2}
      />
      
      {showClientStats && (
        <StatsCard
          title="Total Clients"
          value={totalClientsCount.toString()}
          description="Unique clients"
          icon={<UsersIcon className="h-5 w-5" />}
          trend="up"
          trendValue="9%"
          delay={3}
        />
      )}
      
      <StatsCard
        title="Media Assets"
        value={mediaAssetsCount.toString()}
        description="Total photos"
        icon={<ImageIcon className="h-5 w-5" />}
        trend="up"
        trendValue="22%"
        delay={4}
      />
      
      {showPhotographerInterface && (
        <StatsCard
          title="Properties Shot"
          value={completedShoots.toString()}
          description="Completed shoots"
          icon={<HomeIcon className="h-5 w-5" />}
          trend="up"
          trendValue="14%"
          delay={3}
        />
      )}
    </div>
  );
};
