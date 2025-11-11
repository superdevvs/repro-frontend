import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2 } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

type InvoiceSummaryBucket = {
  id?: string;
  label?: string;
  name?: string;
  period?: string;
  range?: string;
  total?: number;
  revenue?: number;
  shoots?: number;
  value?: number;
  count?: number;
  amount?: number;
};

type InvoiceSummaryResponse = {
  totals?: Record<string, number>;
  breakdowns?: Record<string, InvoiceSummaryBucket[]>;
};

type PastDueInvoice = {
  id: string;
  client: string;
  dueDate?: string | null;
  amount: number;
  status: string;
};

export default function Reports() {
  const [timeframe, setTimeframe] = useState("monthly");
  const [reportType, setReportType] = useState("summary");
  const { role, session } = useAuth();
  const isAdmin = ["admin", "superadmin"].includes(role);

  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery<InvoiceSummaryResponse>({
    queryKey: ["invoice-summary", timeframe, session?.access_token],
    queryFn: async () => {
      const url = `${apiBaseUrl}/api/reports/invoices/summary?range=${encodeURIComponent(timeframe)}`;
      const response = await fetch(url, {
        headers: {
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        credentials: "include",
      });

      if (!response.ok) {
        let message = "Failed to load invoice summary";
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.message === "string") {
            message = errorBody.message;
          }
        } catch (error) {
          console.error("Error parsing summary response", error);
        }
        throw new Error(message);
      }

      return response.json();
    },
    enabled: !!session?.access_token,
  });

  const {
    data: pastDueData,
    isLoading: isPastDueLoading,
    isError: isPastDueError,
    error: pastDueError,
    refetch: refetchPastDue,
  } = useQuery<{ data?: unknown } | PastDueInvoice[] | Record<string, unknown>>({
    queryKey: ["invoice-past-due", session?.access_token],
    queryFn: async () => {
      const url = `${apiBaseUrl}/api/reports/invoices/past-due`;
      const response = await fetch(url, {
        headers: {
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        credentials: "include",
      });

      if (!response.ok) {
        let message = "Failed to load past due invoices";
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.message === "string") {
            message = errorBody.message;
          }
        } catch (error) {
          console.error("Error parsing past due response", error);
        }
        throw new Error(message);
      }

      return response.json();
    },
    enabled: !!session?.access_token,
  });

  const normalizeLabel = (bucket: InvoiceSummaryBucket) => {
    return (
      bucket.label ||
      bucket.name ||
      bucket.period ||
      bucket.range ||
      bucket.id ||
      "Unknown"
    );
  };

  const pickNumericValue = (bucket: InvoiceSummaryBucket, keys: (keyof InvoiceSummaryBucket)[]) => {
    for (const key of keys) {
      const value = bucket[key];
      if (typeof value === "number") {
        return value;
      }
    }
    return 0;
  };

  const revenueChartData = useMemo(() => {
    const revenueBuckets = summaryData?.breakdowns?.revenue || [];
    return revenueBuckets.map((bucket) => ({
      label: normalizeLabel(bucket),
      revenue: pickNumericValue(bucket, ["revenue", "total", "amount", "value"]),
    }));
  }, [summaryData]);

  const shootsChartData = useMemo(() => {
    const shootBuckets = summaryData?.breakdowns?.shoots || [];
    return shootBuckets.map((bucket) => ({
      label: normalizeLabel(bucket),
      shoots: pickNumericValue(bucket, ["shoots", "count", "total", "value"]),
    }));
  }, [summaryData]);

  const photographerData = useMemo(() => {
    const buckets = summaryData?.breakdowns?.photographers || [];
    return buckets.map((bucket) => ({
      name: normalizeLabel(bucket),
      revenue: pickNumericValue(bucket, ["revenue", "total", "amount", "value"]),
      shoots: pickNumericValue(bucket, ["shoots", "count"]),
    }));
  }, [summaryData]);

  const serviceData = useMemo(() => {
    const buckets = summaryData?.breakdowns?.services || [];
    return buckets.map((bucket) => ({
      name: normalizeLabel(bucket),
      value: pickNumericValue(bucket, ["count", "value", "total", "shoots"]),
      revenue: pickNumericValue(bucket, ["revenue", "amount", "total"]),
    }));
  }, [summaryData]);

  const pastDueInvoices = useMemo(() => {
    const raw = Array.isArray(pastDueData)
      ? pastDueData
      : Array.isArray((pastDueData as { data?: unknown })?.data)
      ? ((pastDueData as { data?: unknown }).data as InvoiceSummaryBucket[])
      : Array.isArray((pastDueData as { invoices?: unknown })?.invoices)
      ? ((pastDueData as { invoices?: unknown }).invoices as InvoiceSummaryBucket[])
      : [];

    return raw.map((invoice, index) => {
      const typed = invoice as Record<string, unknown>;
      const id =
        (typed.id as string | undefined) ||
        (typed.invoice_id as string | undefined) ||
        (typed.reference as string | undefined) ||
        `invoice-${index}`;
      const client =
        (typed.client as string | undefined) ||
        (typed.client_name as string | undefined) ||
        (typed.customer as string | undefined) ||
        (typed.customerName as string | undefined) ||
        "Unknown client";
      const dueDate =
        (typed.due_date as string | undefined) ||
        (typed.dueDate as string | undefined) ||
        (typed.due_on as string | undefined) ||
        null;
      const amount =
        (typeof typed.amount_due === "number" && typed.amount_due) ||
        (typeof typed.amount === "number" && typed.amount) ||
        (typeof typed.balance === "number" && typed.balance) ||
        (typeof typed.total === "number" && typed.total) ||
        0;
      const status =
        (typed.status as string | undefined) ||
        (typed.state as string | undefined) ||
        "past_due";

      return {
        id,
        client,
        dueDate,
        amount,
        status,
      } satisfies PastDueInvoice;
    });
  }, [pastDueData]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }),
    []
  );

  const formatDate = (value?: string | null) => {
    if (!value) return "No due date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">Reports</h1>
              <p className="text-muted-foreground mt-1">
                Analytics and reporting for your photography business
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="photographer">By Photographer</SelectItem>
                  <SelectItem value="service">By Service</SelectItem>
                </SelectContent>
              </Select>
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
              {isAdmin && (
                <Button>
                  Export Report
                </Button>
              )}
            </div>
          </div>

          {reportType === "summary" && (
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
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
                      {isSummaryLoading ? (
                        <div className="flex h-full items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : isSummaryError ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-destructive">
                          <p>{(summaryError as Error)?.message || "Failed to load invoice summary"}</p>
                          <Button variant="outline" onClick={() => refetchSummary()}>
                            Try again
                          </Button>
                        </div>
                      ) : revenueChartData.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={revenueChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
                            <Tooltip
                              formatter={(value: number) => currencyFormatter.format(value)}
                              labelFormatter={(label) => `${label}`}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No revenue data available for this range.
                        </div>
                      )}
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
                      {isSummaryLoading ? (
                        <div className="flex h-full items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : isSummaryError ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-destructive">
                          <p>{(summaryError as Error)?.message || "Failed to load invoice summary"}</p>
                          <Button variant="outline" onClick={() => refetchSummary()}>
                            Try again
                          </Button>
                        </div>
                      ) : shootsChartData.length ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={shootsChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="shoots" stroke="#6366f1" name="Number of Shoots" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No shoot data available for this range.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle>Past Due Invoices</CardTitle>
                  <CardDescription>Invoices that require follow-up</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isPastDueLoading ? (
                    <div className="flex h-40 items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : isPastDueError ? (
                    <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-destructive">
                      <p>{(pastDueError as Error)?.message || "Failed to load past due invoices"}</p>
                      <Button variant="outline" onClick={() => refetchPastDue()}>
                        Try again
                      </Button>
                    </div>
                  ) : pastDueInvoices.length ? (
                    <div className="space-y-4">
                      {pastDueInvoices.map((invoice) => (
                        <div key={invoice.id} className="flex flex-col gap-2 rounded-lg border border-border p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{invoice.client}</p>
                              <p className="text-xs text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
                            </div>
                            <Badge variant="destructive" className="capitalize">
                              {invoice.status.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          <p className="text-sm font-semibold">{currencyFormatter.format(invoice.amount)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No past due invoices 🎉</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {reportType === "photographer" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Photographer Revenue</CardTitle>
                  <CardDescription>
                    Revenue by photographer for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isSummaryLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : isSummaryError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-destructive">
                      <p>{(summaryError as Error)?.message || "Failed to load invoice summary"}</p>
                      <Button variant="outline" onClick={() => refetchSummary()}>
                        Try again
                      </Button>
                    </div>
                  ) : photographerData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={photographerData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => currencyFormatter.format(value)} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                        <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No photographer data available for this range.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Photographer Shoot Count</CardTitle>
                  <CardDescription>
                    Number of shoots completed by photographer
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isSummaryLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : isSummaryError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-destructive">
                      <p>{(summaryError as Error)?.message || "Failed to load invoice summary"}</p>
                      <Button variant="outline" onClick={() => refetchSummary()}>
                        Try again
                      </Button>
                    </div>
                  ) : photographerData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={photographerData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip />
                        <Bar dataKey="shoots" fill="#6366f1" name="Number of Shoots" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No photographer data available for this range.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {reportType === "service" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Services Breakdown</CardTitle>
                  <CardDescription>
                    Distribution of services provided
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isSummaryLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : isSummaryError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-destructive">
                      <p>{(summaryError as Error)?.message || "Failed to load invoice summary"}</p>
                      <Button variant="outline" onClick={() => refetchSummary()}>
                        Try again
                      </Button>
                    </div>
                  ) : serviceData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value} shoots`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No service data available for this range.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Services Revenue</CardTitle>
                  <CardDescription>
                    Revenue generated by service type
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {isSummaryLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : isSummaryError ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-destructive">
                      <p>{(summaryError as Error)?.message || "Failed to load invoice summary"}</p>
                      <Button variant="outline" onClick={() => refetchSummary()}>
                        Try again
                      </Button>
                    </div>
                  ) : serviceData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={serviceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
                        <Tooltip formatter={(value: number) => currencyFormatter.format(value)} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No service data available for this range.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
