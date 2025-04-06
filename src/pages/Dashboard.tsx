import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCardGrid } from '@/components/dashboard/StatsCardGrid';
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { useIsMobile } from '@/hooks/use-mobile';
import { useShoots } from '@/context/ShootsContext';
import { TimeRange, filterShootsByDateRange } from '@/utils/dateUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowRightIcon, CameraIcon, CloudIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShootCard } from '@/components/dashboard/ShootCard';
import { compareAsc, parseISO } from 'date-fns';
import { Pagination } from '@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { role } = useAuth();
  const isMobile = useIsMobile();
  const { shoots } = useShoots();
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const navigate = useNavigate();
  
  // Pagination state for upcoming shoots
  const [currentPage, setCurrentPage] = useState(1);
  const shootsPerPage = 3;
  
  const showRevenue = ['admin', 'superadmin'].includes(role);
  const showClientStats = ['admin', 'superadmin'].includes(role);
  const showPhotographerInterface = role === 'photographer';
  const showClientInterface = role === 'client';
  const isAdmin = ['admin', 'superadmin'].includes(role);
  
  // Filter shoots based on selected time range
  const filteredShoots = filterShootsByDateRange(shoots, timeRange);
  
  // Get upcoming shoots
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingShoots = shoots
    .filter(shoot => {
      if (shoot.status !== 'scheduled') return false;
      const shootDate = parseISO(shoot.scheduledDate);
      return compareAsc(shootDate, today) >= 0;
    })
    .sort((a, b) => {
      return compareAsc(parseISO(a.scheduledDate), parseISO(b.scheduledDate));
    });
  
  // Calculate pagination
  const totalPages = Math.ceil(upcomingShoots.length / shootsPerPage);
  const indexOfLastShoot = currentPage * shootsPerPage;
  const indexOfFirstShoot = indexOfLastShoot - shootsPerPage;
  const currentShoots = upcomingShoots.slice(indexOfFirstShoot, indexOfLastShoot);
  
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        <DashboardHeader 
          isAdmin={isAdmin} 
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />
        
        <StatsCardGrid
          showRevenue={showRevenue}
          showClientStats={showClientStats}
          showPhotographerInterface={showPhotographerInterface}
          shoots={filteredShoots}
          timeRange={timeRange}
        />
        
        {showRevenue && <RevenueOverview shoots={filteredShoots} timeRange={timeRange} />}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <CameraIcon className="h-5 w-5 text-primary" />
                <CardTitle>Upcoming Shoots</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={() => navigate('/shoots')}
              >
                View all <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {currentShoots.length > 0 ? (
                <div className="space-y-4">
                  {currentShoots.map((shoot, index) => (
                    <ShootCard
                      key={shoot.id}
                      id={shoot.id}
                      address={shoot.location.fullAddress}
                      date={shoot.scheduledDate}
                      time="10:00 AM - 12:00 PM" // This should come from actual data in a real app
                      photographer={{
                        name: shoot.photographer.name,
                        avatar: shoot.photographer.avatar || "https://ui.shadcn.com/avatars/01.png",
                      }}
                      client={{
                        name: shoot.client.name,
                      }}
                      status={shoot.status as "scheduled" | "completed" | "pending" | "hold" | "booked"}
                      price={shoot.payment.totalQuote}
                      delay={index}
                      onClick={() => navigate(`/shoots?id=${shoot.id}`)}
                    />
                  ))}
                  
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                      <Pagination>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                          Previous
                        </Button>
                        <div className="flex items-center mx-2">
                          <span className="text-sm">
                            Page {currentPage} of {totalPages}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                          Next
                        </Button>
                      </Pagination>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No upcoming shoots scheduled.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => navigate('/book-shoot')}
                  >
                    Book a Shoot
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {!showClientInterface && <TaskManager />}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
