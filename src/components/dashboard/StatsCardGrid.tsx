
import React from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { CameraIcon, DollarSignIcon, UsersIcon, ImageIcon, HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardGridProps {
  showRevenue: boolean;
  showClientStats: boolean;
  showPhotographerInterface: boolean;
}

export const StatsCardGrid: React.FC<StatsCardGridProps> = ({
  showRevenue,
  showClientStats,
  showPhotographerInterface,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {showRevenue && (
        <StatsCard
          title="Total Revenue"
          value="$42,500"
          description="This month"
          icon={<DollarSignIcon className="h-5 w-5" />}
          trend="up"
          trendValue="12%"
          delay={0}
        />
      )}
      
      <StatsCard
        title="Active Shoots"
        value="24"
        description="8 scheduled today"
        icon={<CameraIcon className="h-5 w-5" />}
        trend="up"
        trendValue="4"
        delay={1}
      />
      
      {showClientStats && (
        <StatsCard
          title="Total Clients"
          value="145"
          description="12 new this month"
          icon={<UsersIcon className="h-5 w-5" />}
          trend="up"
          trendValue="9%"
          delay={2}
        />
      )}
      
      <StatsCard
        title="Media Assets"
        value="3,456"
        description="268 added this week"
        icon={<ImageIcon className="h-5 w-5" />}
        trend="up"
        trendValue="22%"
        delay={3}
      />
      
      {showPhotographerInterface && (
        <StatsCard
          title="Properties Shot"
          value="87"
          description="This quarter"
          icon={<HomeIcon className="h-5 w-5" />}
          trend="up"
          trendValue="14%"
          delay={2}
        />
      )}
    </div>
  );
};
