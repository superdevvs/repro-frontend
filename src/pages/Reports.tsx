
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 2780 },
  { month: 'May', revenue: 1890 },
  { month: 'Jun', revenue: 2390 },
  { month: 'Jul', revenue: 3490 },
  { month: 'Aug', revenue: 4000 },
  { month: 'Sep', revenue: 5000 },
  { month: 'Oct', revenue: 6000 },
  { month: 'Nov', revenue: 4500 },
  { month: 'Dec', revenue: 3800 },
];

const quarterlyData = [
  { quarter: 'Q1', revenue: 9000, shoots: 45 },
  { quarter: 'Q2', revenue: 7060, shoots: 35 },
  { quarter: 'Q3', revenue: 12490, shoots: 62 },
  { quarter: 'Q4', revenue: 14300, shoots: 71 },
];

const yearlyData = [
  { year: '2020', revenue: 35000, shoots: 175 },
  { year: '2021', revenue: 42000, shoots: 210 },
  { year: '2022', revenue: 48000, shoots: 240 },
  { year: '2023', revenue: 54000, shoots: 270 },
  { year: '2024', revenue: 30000, shoots: 150 },
];

const shootsData = [
  { month: 'Jan', shoots: 20 },
  { month: 'Feb', shoots: 15 },
  { month: 'Mar', shoots: 10 },
  { month: 'Apr', shoots: 14 },
  { month: 'May', shoots: 9 },
  { month: 'Jun', shoots: 12 },
  { month: 'Jul', shoots: 17 },
  { month: 'Aug', shoots: 20 },
  { month: 'Sep', shoots: 25 },
  { month: 'Oct', shoots: 30 },
  { month: 'Nov', shoots: 22 },
  { month: 'Dec', shoots: 19 },
];

export default function Reports() {
  const [timeframe, setTimeframe] = useState("monthly");

  const getDataForTimeframe = (dataType: "revenue" | "shoots") => {
    switch (timeframe) {
      case "monthly":
        return dataType === "revenue" ? revenueData : shootsData;
      case "quarterly":
        return quarterlyData;
      case "yearly":
        return yearlyData;
      default:
        return dataType === "revenue" ? revenueData : shootsData;
    }
  };

  const getXAxisKey = () => {
    switch (timeframe) {
      case "monthly":
        return "month";
      case "quarterly":
        return "quarter";
      case "yearly":
        return "year";
      default:
        return "month";
    }
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Reports</h1>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="shoots">Shoots</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    {timeframe === "monthly" && "Monthly revenue breakdown for the current year"}
                    {timeframe === "quarterly" && "Quarterly revenue breakdown for the current year"}
                    {timeframe === "yearly" && "Yearly revenue breakdown for the past 5 years"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getDataForTimeframe("revenue")}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={getXAxisKey()} />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shoots">
              <Card>
                <CardHeader>
                  <CardTitle>Shoots Overview</CardTitle>
                  <CardDescription>
                    {timeframe === "monthly" && "Monthly shoots breakdown for the current year"}
                    {timeframe === "quarterly" && "Quarterly shoots breakdown for the current year"}
                    {timeframe === "yearly" && "Yearly shoots breakdown for the past 5 years"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getDataForTimeframe("shoots")}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={getXAxisKey()} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="shoots" stroke="#6366f1" name="Number of Shoots" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
