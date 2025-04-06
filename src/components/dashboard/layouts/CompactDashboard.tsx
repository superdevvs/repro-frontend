
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/dashboard/Calendar';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { ShootData } from '@/types/shoots';
import { TimeRange } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface CompactDashboardProps {
  showRevenue: boolean;
  showClientStats: boolean;
  showPhotographerInterface: boolean;
  shoots: ShootData[];
  timeRange: TimeRange;
  filteredShoots: ShootData[];
}

export const CompactDashboard: React.FC<CompactDashboardProps> = ({
  showRevenue,
  showClientStats,
  showPhotographerInterface,
  shoots,
  timeRange,
  filteredShoots,
}) => {
  return (
    <div className="grid grid-cols-12 gap-4 h-[calc(100vh-80px)]">
      {/* Left Column - Stats and Revenue */}
      <div className="col-span-12 lg:col-span-6 flex flex-col space-y-4 h-full">
        <div className="flex-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-y-auto max-h-[220px] glass-card p-2">
              <StatsCardGrid
                showRevenue={showRevenue}
                showClientStats={showClientStats}
                showPhotographerInterface={showPhotographerInterface}
                shoots={filteredShoots}
                timeRange={timeRange}
              />
            </Card>
          </motion.div>
        </div>
        
        {showRevenue && (
          <div className="flex-grow overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="h-full"
            >
              <Card className="h-full glass-card">
                <RevenueOverview shoots={filteredShoots} timeRange={timeRange} />
              </Card>
            </motion.div>
          </div>
        )}
        
        {!showRevenue && (
          <div className="flex-grow overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="h-full"
            >
              <Card className="h-full glass-card p-4">
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Additional content for non-admin users</p>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
      
      {/* Middle Column - Calendar */}
      <div className="col-span-12 lg:col-span-3 flex flex-col space-y-4 h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="h-full"
        >
          <Card className="h-full glass-card">
            <Calendar height={400} />
          </Card>
        </motion.div>
      </div>
      
      {/* Right Column - Upcoming Shoots and Tasks */}
      <div className="col-span-12 lg:col-span-3 flex flex-col space-y-4 h-full">
        <div className="flex-none">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="glass-card max-h-[280px] overflow-hidden">
              <UpcomingShoots />
            </Card>
          </motion.div>
        </div>
        
        <div className="flex-grow overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="h-full"
          >
            <Card className="h-full glass-card overflow-hidden">
              <TaskManager 
                className="h-full" 
                showAllTasks={false}
              />
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
