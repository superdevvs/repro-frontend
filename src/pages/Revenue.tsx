import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskManager } from "@/components/dashboard/TaskManager";
import { useAuth } from "@/components/auth/AuthProvider";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCardGrid } from "@/components/dashboard/StatsCardGrid";
import { RevenueOverview } from '@/components/dashboard/RevenueOverview';
import { useIsMobile } from "@/hooks/use-mobile";
import { useShoots } from "@/context/ShootsContext";
import { TimeRange, filterShootsByDateRange } from "@/utils/dateUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRightIcon, CameraIcon } from "lucide-react";
import { compareAsc, parseISO } from "date-fns";
import { Pagination } from "@/components/ui/pagination";
import { useNavigate } from "react-router-dom";
import { RevenueCharts } from "@/components/accounting/RevenueCharts";


const Revenue = () => {
  const { role } = useAuth();
  const isMobile = useIsMobile();
  const { shoots } = useShoots();
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const navigate = useNavigate();

  // Pagination state for upcoming shoots
  const [currentPage, setCurrentPage] = useState(1);
  const shootsPerPage = 3;

  const showRevenue = ["admin", "superadmin"].includes(role);
  const showClientStats = ["admin", "superadmin"].includes(role);
  const showPhotographerInterface = role === "photographer";
  const showClientInterface = role === "client";
  const isAdmin = ["admin", "superadmin"].includes(role);

  // Filter shoots based on selected time range
  const filteredShoots = filterShootsByDateRange(shoots, timeRange);

  // Get upcoming shoots
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingShoots = shoots
    .filter((shoot) => {
      if (shoot.status !== "scheduled") return false;
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
  const currentShoots = upcomingShoots.slice(
    indexOfFirstShoot,
    indexOfLastShoot
  );

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

   const [invoiceTimeFilter, setInvoiceTimeFilter] = useState<
    "day" | "week" | "month" | "quarter" | "year"
  >("month");

  // TODO: Replace this stub with your real invoices source
//   const invoices: InvoiceData[] = [];

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 pb-10">
        <DashboardHeader
          isAdmin={isAdmin}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
        />



        {showRevenue && <RevenueOverview shoots={filteredShoots} timeRange={timeRange} />}

        {/* Improved layout for Calendar, Upcoming Shoots, and Task Manager */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full h-full"> */}
          {/* Left side (Calendar) */}
          {/* {!showClientInterface && (
    <div className="lg:col-span-7">
      <Calendar height={400} />
    </div>
  )} */}

          {/* Upcoming Shoots + Task Manager (full width) */}
          {/* <div className="col-span-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full"> */}
              {/* Upcoming Shoots */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Card className="glass-card h-full">
                  <div className="flex flex-row items-center justify-between p-4 pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <CameraIcon className="h-5 w-5 text-primary" />
                      <h3 className="font-medium text-lg">Upcoming Shoots</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => navigate("/shoots")}
                    >
                      View all <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-4 max-h-[calc(100vh-250px)] overflow-y-auto">
                    {currentShoots.length > 0 ? (
                      <div className="space-y-3">
                        {currentShoots.map((shoot) => (
                          <div
                            key={shoot.id}
                            className="bg-secondary/10 p-3 rounded-md cursor-pointer hover:bg-secondary/20 transition-colors"
                            onClick={() => navigate(`/shoots?id=${shoot.id}`)}
                          >
                            <div className="flex flex-col">
                              <p className="font-medium truncate">
                                {shoot.location.fullAddress}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <span>
                                  {new Date(
                                    shoot.scheduledDate
                                  ).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span className="truncate">
                                  {shoot.photographer.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <p className="text-muted-foreground">
                          No upcoming shoots scheduled.
                        </p>
                        {role !== "photographer" && role !== "editor" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => navigate("/book-shoot")}
                          >
                            Book a Shoot
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div> */}

              {/* Task Manager */}
              {/* {!showClientInterface && (
                <div className="h-full">
                  <Card className="glass-card h-full p-4">
                    <TaskManager />
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div> */}
        <div className="w-full">
          <StatsCardGrid
            showRevenue={showRevenue}
            showClientStats={showClientStats}
            showPhotographerInterface={showPhotographerInterface}
            shoots={filteredShoots}
            timeRange={timeRange}
          />
          {showRevenue && (
            <RevenueCharts
              invoices={invoices}
              timeFilter={invoiceTimeFilter}
              onTimeFilterChange={setInvoiceTimeFilter}
              variant="full"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Revenue;
