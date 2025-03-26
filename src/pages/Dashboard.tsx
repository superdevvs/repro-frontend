
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Calendar } from '@/components/dashboard/Calendar';
import { UpcomingShoots } from '@/components/dashboard/UpcomingShoots';
import { TaskManager } from '@/components/dashboard/TaskManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { CalendarIcon, CameraIcon, DollarSignIcon, ImageIcon, UsersIcon, PlusIcon, HomeIcon, BarChart3Icon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  Line,
  LineChart
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';

const revenueData = [
  { name: 'Jan', revenue: 4000, growth: 0.4, profit: 1200 },
  { name: 'Feb', revenue: 5500, growth: 0.25, profit: 1650 },
  { name: 'Mar', revenue: 7800, growth: 0.35, profit: 2340 },
  { name: 'Apr', revenue: 8200, growth: 0.05, profit: 2460 },
  { name: 'May', revenue: 9000, growth: 0.1, profit: 2700 },
  { name: 'Jun', revenue: 10500, growth: 0.17, profit: 3150 },
];

const Dashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  
  const showRevenue = ['admin', 'superadmin'].includes(role);
  const showClientStats = ['admin', 'superadmin'].includes(role);
  const showPhotographerInterface = role === 'photographer';
  const showClientInterface = role === 'client';
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
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
        
        {showRevenue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <BarChart3Icon className="h-5 w-5 text-primary" />
                  <CardTitle>Revenue Overview</CardTitle>
                </div>
                <Badge variant="outline">2023</Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Monthly Revenue</h3>
                    <ChartContainer 
                      config={{
                        revenue: {
                          label: "Revenue",
                          theme: {
                            light: "#8B5CF6",
                            dark: "#8B5CF6"
                          }
                        },
                        profit: {
                          label: "Profit",
                          theme: {
                            light: "#D946EF",
                            dark: "#D946EF"
                          }
                        }
                      }} 
                      className="h-[200px]"
                    >
                      <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D946EF" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#D946EF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => `$${value}`} />} />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#8B5CF6" 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="profit" 
                          stroke="#D946EF" 
                          fillOpacity={1} 
                          fill="url(#colorProfit)" 
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Growth Trend</h3>
                    <ChartContainer 
                      config={{
                        growth: {
                          label: "Growth Rate",
                          theme: {
                            light: "#F97316",
                            dark: "#F97316"
                          }
                        }
                      }} 
                      className="h-[200px]"
                    >
                      <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis 
                          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                          tick={{ fontSize: 10 }} 
                          tickLine={false} 
                          axisLine={false}
                          domain={[0, 0.5]} 
                        />
                        <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${(value * 100).toFixed(1)}%`} />} />
                        <Line 
                          type="monotone" 
                          dataKey="growth" 
                          stroke="#F97316" 
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UpcomingShoots />
          </div>
          
          <div className="lg:col-span-2">
            <Calendar height={300} />
          </div>
        </div>
        
        {!showClientInterface && (
          <div>
            <TaskManager />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
