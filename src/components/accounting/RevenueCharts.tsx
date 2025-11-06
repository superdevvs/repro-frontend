
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, LineChart, DonutChart } from '@/components/charts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { InvoiceData } from '@/utils/invoiceUtils';
import { Calendar, Clock, BarChart3, PieChart, LineChart as LineChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RevenueChartsProps {
  invoices: InvoiceData[];
  timeFilter: 'day' | 'week' | 'month' | 'quarter' | 'year';
  onTimeFilterChange: (filter: 'day' | 'week' | 'month' | 'quarter' | 'year') => void;
  variant?: 'full' | 'compact'; 
}

export function RevenueCharts({ 
  invoices, 
  timeFilter, 
  onTimeFilterChange,
  variant = 'full',
}: RevenueChartsProps) {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  // Generate monthly data based on invoices
  const getMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const revenueData = months.map(month => {
      // In a real app, we would filter by actual dates
      // For demo, we'll generate some random data
      const revenue = Math.floor(Math.random() * 10000) + 1000;
      const expenses = Math.floor(Math.random() * revenue * 0.7);
      const profit = revenue - expenses;
      
      return {
        month,
        revenue,
        expenses,
        profit
      };
    });
    
    return revenueData;
  };
  
  // Get expense breakdown data
  const getExpenseData = () => {
    return [
      { name: 'Equipment', value: 5400 },
      { name: 'Software', value: 3200 },
      { name: 'Marketing', value: 2100 },
      { name: 'Office', value: 1800 },
      { name: 'Travel', value: 1500 },
    ];
  };
  
  const monthlyData = getMonthlyData();
  const expenseData = getExpenseData();
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Revenue Overview
              </CardTitle>
              <CardDescription>
                Financial performance metrics
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as any)}>
                <ToggleGroupItem value="area" aria-label="Area Chart">
                  <LineChartIcon className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="bar" aria-label="Bar Chart">
                  <BarChart3 className="h-3.5 w-3.5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="line" aria-label="Line Chart">
                  <LineChartIcon className="h-3.5 w-3.5" />
                </ToggleGroupItem>
              </ToggleGroup>
              
              <ToggleGroup 
                type="single" 
                value={timeFilter} 
                onValueChange={(value) => value && onTimeFilterChange(value as any)}
              >
                <ToggleGroupItem value="day" aria-label="Day view" className="text-xs h-8">
                  Day
                </ToggleGroupItem>
                <ToggleGroupItem value="week" aria-label="Week view" className="text-xs h-8">
                  Week
                </ToggleGroupItem>
                <ToggleGroupItem value="month" aria-label="Month view" className="text-xs h-8">
                  Month
                </ToggleGroupItem>
                <ToggleGroupItem value="quarter" aria-label="Quarter view" className="text-xs h-8">
                  Quarter
                </ToggleGroupItem>
                <ToggleGroupItem value="year" aria-label="Year view" className="text-xs h-8">
                  Year
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-3 pb-6">
          <div className="h-[300px]">
            {chartType === 'area' && (
              <AreaChart 
                data={monthlyData}
                index="month"
                categories={["revenue", "expenses", "profit"]}
                colors={["#3b82f6", "#ef4444", "#22c55e"]} 
                valueFormatter={(value) => `$${value.toLocaleString()}`}
              />
            )}
            
            {chartType === 'bar' && (
              <BarChart 
                data={monthlyData}
                index="month"
                categories={["revenue", "expenses", "profit"]}
                colors={["#3b82f6", "#ef4444", "#22c55e"]} 
                valueFormatter={(value) => `$${value.toLocaleString()}`}
                stack={false}
              />
            )}
            
            {chartType === 'line' && (
              <LineChart 
                data={monthlyData}
                index="month"
                categories={["revenue", "expenses", "profit"]}
                colors={["#3b82f6", "#ef4444", "#22c55e"]} 
                valueFormatter={(value) => `$${value.toLocaleString()}`}
                connectNulls
                curveType="natural"
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {variant === 'full' && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden border">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>
              How your expenses are distributed
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[200px]">
              <DonutChart 
                data={expenseData}
                category="value"
                index="name"
                valueFormatter={(value) => `$${value.toLocaleString()}`}
                className="mt-6"
                colors={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden border">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium text-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Payment Schedule
                </CardTitle>
                <CardDescription>
                  Upcoming payments for this month
                </CardDescription>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices
                .filter(inv => inv.status === 'pending')
                .slice(0, 3)
                .map((invoice, i) => (
                  <div key={invoice.id} className="flex justify-between items-center pb-2 border-b border-border/60">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium",
                        "bg-primary/10 text-primary"
                      )}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{invoice.client}</p>
                        <p className="text-xs text-muted-foreground">Due: {invoice.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                      <p className="text-xs text-amber-500 font-medium">Pending</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}
