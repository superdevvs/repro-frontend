
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar } from '@/components/dashboard/Calendar';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { CalendarIcon, CameraIcon, DollarSignIcon, ImageIcon, UsersIcon, PlusIcon, HomeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 5500 },
  { name: 'Mar', revenue: 7800 },
  { name: 'Apr', revenue: 8200 },
  { name: 'May', revenue: 9000 },
  { name: 'Jun', revenue: 10500 },
];

const Dashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  
  // Show different stats based on role
  const showRevenue = ['admin', 'superadmin'].includes(role);
  const showClientStats = ['admin', 'superadmin'].includes(role);
  const showPhotographerInterface = role === 'photographer';
  const showClientInterface = role === 'client';
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Dashboard
            </Badge>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your shoots today.
            </p>
          </div>
          
          {['admin', 'superadmin'].includes(role) && (
            <Button onClick={() => navigate('/book-shoot')} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Book New Shoot
            </Button>
          )}
        </div>
        
        {/* Stats cards */}
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
        
        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar takes up 2 columns */}
          <div className="lg:col-span-2">
            <Calendar />
          </div>
          
          {/* Upcoming shoots takes up 1 column */}
          <div className="lg:col-span-1">
            <UpcomingShoots />
          </div>
        </div>
        
        {/* Revenue chart for admins */}
        {showRevenue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Revenue Overview</CardTitle>
                </div>
                <Badge variant="outline">2023</Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ 
                        background: 'rgba(255, 255, 255, 0.8)', 
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
