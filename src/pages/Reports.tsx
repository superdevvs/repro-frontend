
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { shootsData } from "@/data/shootsData";
import { Badge } from "@/components/ui/badge";

// Group data by month
const getMonthlyData = () => {
  const monthData: Record<string, { revenue: number, shoots: number }> = {
    'Jan': { revenue: 0, shoots: 0 },
    'Feb': { revenue: 0, shoots: 0 },
    'Mar': { revenue: 0, shoots: 0 },
    'Apr': { revenue: 0, shoots: 0 },
    'May': { revenue: 0, shoots: 0 },
    'Jun': { revenue: 0, shoots: 0 },
    'Jul': { revenue: 0, shoots: 0 },
    'Aug': { revenue: 0, shoots: 0 },
    'Sep': { revenue: 0, shoots: 0 },
    'Oct': { revenue: 0, shoots: 0 },
    'Nov': { revenue: 0, shoots: 0 },
    'Dec': { revenue: 0, shoots: 0 },
  };

  // Sort data by month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Process the shoots data
  shootsData.forEach(shoot => {
    // Extract month from shoot.scheduled (format: "MM/DD/YYYY")
    const month = parseInt(shoot.scheduled.split('/')[0]) - 1; // 0-based month
    if (month >= 0 && month < 12) {
      const monthKey = months[month];
      monthData[monthKey].revenue += shoot.pricing.totalQuote;
      monthData[monthKey].shoots += 1;
    }
  });

  // Convert to array format for charts
  return months.map(month => ({
    month,
    revenue: monthData[month].revenue,
    shoots: monthData[month].shoots
  }));
};

// Group data by quarter
const getQuarterlyData = () => {
  const quarterData: Record<string, { revenue: number, shoots: number }> = {
    'Q1': { revenue: 0, shoots: 0 },
    'Q2': { revenue: 0, shoots: 0 },
    'Q3': { revenue: 0, shoots: 0 },
    'Q4': { revenue: 0, shoots: 0 },
  };

  // Process the shoots data
  shootsData.forEach(shoot => {
    // Extract month from shoot.scheduled (format: "MM/DD/YYYY")
    const month = parseInt(shoot.scheduled.split('/')[0]) - 1; // 0-based month
    const quarter = Math.floor(month / 3);
    if (quarter >= 0 && quarter < 4) {
      const quarterKey = `Q${quarter + 1}`;
      quarterData[quarterKey].revenue += shoot.pricing.totalQuote;
      quarterData[quarterKey].shoots += 1;
    }
  });

  // Convert to array format for charts
  return ['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => ({
    quarter,
    revenue: quarterData[quarter].revenue,
    shoots: quarterData[quarter].shoots
  }));
};

// Group data by photographer
const getPhotographerData = () => {
  const photographerData: Record<string, { revenue: number, shoots: number }> = {};

  // Process the shoots data
  shootsData.forEach(shoot => {
    const photographerName = shoot.photographer.name;
    if (!photographerData[photographerName]) {
      photographerData[photographerName] = { revenue: 0, shoots: 0 };
    }
    photographerData[photographerName].revenue += shoot.pricing.totalQuote;
    photographerData[photographerName].shoots += 1;
  });

  // Convert to array format for charts
  return Object.entries(photographerData).map(([name, data]) => ({
    name,
    revenue: data.revenue,
    shoots: data.shoots
  }));
};

// Group data by service type
const getServiceData = () => {
  const serviceData: Record<string, { revenue: number, count: number }> = {};

  // Process the shoots data
  shootsData.forEach(shoot => {
    shoot.services.forEach(service => {
      if (!serviceData[service]) {
        serviceData[service] = { revenue: 0, count: 0 };
      }
      // Distribute the revenue evenly among services
      serviceData[service].revenue += shoot.pricing.totalQuote / shoot.services.length;
      serviceData[service].count += 1;
    });
  });

  // Convert to array format for charts
  return Object.entries(serviceData).map(([name, data]) => ({
    name,
    revenue: Math.round(data.revenue),
    count: data.count
  }));
};

// Calculate summary statistics
const getSummaryStats = () => {
  let totalRevenue = 0;
  let totalShoots = shootsData.length;
  let totalCompleted = 0;
  let totalScheduled = 0;
  
  shootsData.forEach(shoot => {
    totalRevenue += shoot.pricing.totalQuote;
    if (shoot.status === 'completed') {
      totalCompleted++;
    } else if (shoot.status === 'scheduled') {
      totalScheduled++;
    }
  });

  const avgRevenuePerShoot = totalShoots > 0 ? totalRevenue / totalShoots : 0;

  return {
    totalRevenue,
    totalShoots,
    totalCompleted,
    totalScheduled,
    avgRevenuePerShoot
  };
};

// Colors for pie charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export default function Reports() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [reportType, setReportType] = useState("revenue");

  const monthlyData = getMonthlyData();
  const quarterlyData = getQuarterlyData();
  const photographerData = getPhotographerData();
  const serviceData = getServiceData();
  const summaryStats = getSummaryStats();

  const getDataForTimeframe = () => {
    switch (timeframe) {
      case "monthly":
        return monthlyData;
      case "quarterly":
        return quarterlyData;
      case "photographer":
        return photographerData;
      case "service":
        return serviceData;
      default:
        return monthlyData;
    }
  };

  const getXAxisKey = () => {
    switch (timeframe) {
      case "monthly":
        return "month";
      case "quarterly":
        return "quarter";
      case "photographer":
      case "service":
        return "name";
      default:
        return "month";
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Analytics
              </Badge>
              <h1 className="text-3xl font-bold">Reports</h1>
              <p className="text-muted-foreground">
                Analyze revenue, shoots, and performance metrics.
              </p>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="photographer">By Photographer</SelectItem>
                <SelectItem value="service">By Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryStats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {summaryStats.totalShoots} shoots
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Revenue per Shoot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryStats.avgRevenuePerShoot)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on all shoots
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Shoots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryStats.totalCompleted}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of {summaryStats.totalShoots} total shoots
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Upcoming Shoots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryStats.totalScheduled}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled and not completed
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="revenue" className="w-full" onValueChange={setReportType}>
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="shoots">Shoots</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>
                      {timeframe === "monthly" && "Monthly revenue breakdown"}
                      {timeframe === "quarterly" && "Quarterly revenue breakdown"}
                      {timeframe === "photographer" && "Revenue by photographer"}
                      {timeframe === "service" && "Revenue by service type"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getDataForTimeframe()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey={getXAxisKey()} 
                          angle={timeframe === "photographer" || timeframe === "service" ? -45 : 0}
                          textAnchor={timeframe === "photographer" || timeframe === "service" ? "end" : "middle"}
                          height={70}
                        />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, "Revenue"]} 
                          labelFormatter={(label) => {
                            if (timeframe === "monthly") return `Month: ${label}`;
                            if (timeframe === "quarterly") return `Quarter: ${label}`;
                            return `${label}`;
                          }}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Distribution</CardTitle>
                    <CardDescription>
                      {timeframe === "monthly" && "Monthly distribution"}
                      {timeframe === "quarterly" && "Quarterly distribution"}
                      {timeframe === "photographer" && "By photographer"}
                      {timeframe === "service" && "By service"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getDataForTimeframe()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                          nameKey={getXAxisKey()}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getDataForTimeframe().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Revenue Details</CardTitle>
                  <CardDescription>
                    Detailed breakdown of revenue sources
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{getXAxisKey().charAt(0).toUpperCase() + getXAxisKey().slice(1)}</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Shoots</TableHead>
                        <TableHead className="text-right">Avg per Shoot</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getDataForTimeframe().map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item[getXAxisKey() as keyof typeof item]}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.revenue)}</TableCell>
                          <TableCell className="text-right">{item.shoots || (item as any).count || 0}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.revenue / (item.shoots || (item as any).count || 1))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shoots">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Shoots Overview</CardTitle>
                    <CardDescription>
                      {timeframe === "monthly" && "Monthly shoots breakdown"}
                      {timeframe === "quarterly" && "Quarterly shoots breakdown"}
                      {timeframe === "photographer" && "Shoots by photographer"}
                      {timeframe === "service" && "Shoots by service type"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getDataForTimeframe()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey={getXAxisKey()} 
                          angle={timeframe === "photographer" || timeframe === "service" ? -45 : 0}
                          textAnchor={timeframe === "photographer" || timeframe === "service" ? "end" : "middle"}
                          height={70}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [value, "Shoots"]} 
                          labelFormatter={(label) => {
                            if (timeframe === "monthly") return `Month: ${label}`;
                            if (timeframe === "quarterly") return `Quarter: ${label}`;
                            return `${label}`;
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey={timeframe === "service" ? "count" : "shoots"} 
                          stroke="#6366f1" 
                          name="Number of Shoots" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shoots Distribution</CardTitle>
                    <CardDescription>
                      {timeframe === "monthly" && "Monthly distribution"}
                      {timeframe === "quarterly" && "Quarterly distribution"}
                      {timeframe === "photographer" && "By photographer"}
                      {timeframe === "service" && "By service"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getDataForTimeframe()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey={timeframe === "service" ? "count" : "shoots"}
                          nameKey={getXAxisKey()}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getDataForTimeframe().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, "Shoots"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
