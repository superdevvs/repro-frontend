
import React, { useState, useEffect } from 'react';
import { Shell } from '@/components/layout/Shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, FilterIcon, SlidersHorizontal, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { shootsData } from '@/data/shootsData';
import { ShootData } from '@/types/shoots';
import { cn } from '@/lib/utils';

export function ShootHistory() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('date');
  const [filteredShoots, setFilteredShoots] = useState<ShootData[]>(shootsData);

  useEffect(() => {
    // Apply filtering logic based on selected filter
    let newFilteredShoots = [...shootsData];

    if (filter !== 'all') {
      newFilteredShoots = shootsData.filter(shoot => shoot.status === filter);
    }

    // Apply sorting logic based on selected sort order
    if (sortOrder === 'date') {
      newFilteredShoots.sort((a, b) => {
        const dateA = new Date(a.scheduledDate).getTime();
        const dateB = new Date(b.scheduledDate).getTime();
        return dateB - dateA; // Sort by most recent date
      });
    } else if (sortOrder === 'client') {
      newFilteredShoots.sort((a, b) => a.client.name.localeCompare(b.client.name));
    }

    setFilteredShoots(newFilteredShoots);
  }, [filter, sortOrder]);

  return (
    <Shell>
      <div className="md:flex items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Shoot History</h1>
          <p className="text-muted-foreground">
            Review and manage past photography sessions.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date('2023-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shoot ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShoots.map((shoot) => (
                  <TableRow key={shoot.id}>
                    <TableCell className="font-medium">{shoot.id}</TableCell>
                    <TableCell>{shoot.client.name}</TableCell>
                    <TableCell>
                      {typeof shoot.scheduledDate === 'string' 
                        ? format(parseISO(shoot.scheduledDate), 'PPP')
                        : format(shoot.scheduledDate, 'PPP')}
                    </TableCell>
                    <TableCell>{shoot.location?.address || 'No address'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{shoot.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${shoot.payment.totalPaid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <div>Completed shoots content</div>
        </TabsContent>
        <TabsContent value="scheduled" className="mt-4">
          <div>Scheduled shoots content</div>
        </TabsContent>
        <TabsContent value="in-progress" className="mt-4">
          <div>In progress shoots content</div>
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <div>Cancelled shoots content</div>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}

export default ShootHistory;
