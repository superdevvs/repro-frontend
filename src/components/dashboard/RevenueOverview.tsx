
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3Icon } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart,
  Line
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { ShootData } from '@/types/shoots';
import { TimeRange } from '@/utils/dateUtils';
import { format, parseISO, getMonth, getYear } from 'date-fns';

interface RevenueOverviewProps {
  shoots: ShootData[];
  timeRange: TimeRange;
}

export const RevenueOverview: React.FC<RevenueOverviewProps> = ({ shoots, timeRange }) => {
  // Generate revenue data based on actual shoots
  const currentYear = new Date().getFullYear();

  // Process data for charts
  const generateRevenueData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(month => ({
      name: month,
      revenue: 0,
      profit: 0,
      growth: 0,
      count: 0
    }));

    // Filter paid shoots from the current year
    const paidShoots = shoots.filter(shoot => {
      if (!shoot.payment.totalPaid) return false;
      const shootDate = new Date(shoot.scheduledDate);
      return getYear(shootDate) === currentYear;
    });

    // Aggregate revenue by month
    paidShoots.forEach(shoot => {
      const shootDate = new Date(shoot.scheduledDate);
      const monthIndex = getMonth(shootDate);
      const amount = shoot.payment.totalPaid || 0;
      
      data[monthIndex].revenue += amount;
      data[monthIndex].profit += amount * 0.3; // Assuming 30% profit margin
      data[monthIndex].count += 1;
    });

    // Calculate growth rates
    for (let i = 1; i < data.length; i++) {
      if (data[i-1].revenue > 0) {
        data[i].growth = (data[i].revenue - data[i-1].revenue) / data[i-1].revenue;
      } else {
        data[i].growth = data[i].revenue > 0 ? 1 : 0;
      }
    }

    return data;
  };

  const revenueData = generateRevenueData();
  
  return (
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
          <Badge variant="outline">{currentYear}</Badge>
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
                    tickFormatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} 
                    tick={{ fontSize: 10 }} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, 0.5]} 
                  />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />} />
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
  );
};
