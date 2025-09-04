import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { Eye, Calendar, Clock, ChevronRight, Building, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShootData } from '@/types/shoots';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ShootDetailDialog } from '@/components/ShootDetailDialog'; // ADD THIS IMPORT


const statusColors: { [key: string]: string } = {
  'scheduled': 'bg-blue-500',
  'completed': 'bg-green-500',
  // 'pending': 'bg-yellow-500',
  // 'hold': 'bg-purple-500',
  // 'booked': 'bg-orange-500',
};

const ShootHistory = () => {
  const [shoots, setShoots] = useState<ShootData[]>([]);
  const [activeTab, setActiveTab] = useState('scheduled');
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterAddress, setFilterAddress] = useState('');
  const [filterPhotographer, setFilterPhotographer] = useState('');
  
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsDetailDialogOpen(true);
  };

  // Fetch shoots from the API when the component mounts
  useEffect(() => {
    const fetchClientShoots = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast({ title: "Authentication Error", description: "No auth token found. Please log in.", variant: "destructive" });
        setIsLoading(false);
        return;
      }

      try {
        // IMPORTANT: Adjust this API endpoint if clients have a different URL than photographers
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shoots`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch shoots');
        }

        const data = await res.json();
        
        // Map the API response to the ShootData type, same as in your Shoots component
        const mappedShoots: ShootData[] = data.data.map((item: any) => ({
          id: String(item.id),
          scheduledDate: item.scheduled_date,
          time: item.time,
          client: {
            id: String(item.client.id),
            name: item.client.name,
            email: item.client.email,
            company: item.client.company_name || '',
            phone: item.client.phonenumber,
            totalShoots: 0,
          },
          location: {
            address: item.address,
            address2: '',
            city: item.city,
            state: item.state,
            zip: item.zip,
            fullAddress: `${item.address}, ${item.city}, ${item.state} ${item.zip}`,
          },
          photographer: {
            id: String(item.photographer.id),
            name: item.photographer.name,
            avatar: item.photographer.avatar,
          },
          services: [item.service?.name || 'Unknown'],
          payment: {
            baseQuote: parseFloat(item.base_quote),
            taxRate: 0,
            taxAmount: parseFloat(item.tax_amount),
            totalQuote: parseFloat(item.total_quote),
            totalPaid: item.payment_status === 'paid' ? parseFloat(item.total_quote) : 0,
            lastPaymentDate: undefined,
            lastPaymentType: item.payment_type || undefined,
          },
          status: item.status,
          notes: item.notes,
          createdBy: item.created_by,
          completedDate: undefined,
          files: [], // You can map files here if needed
        }));
        setShoots(mappedShoots);

      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Could not fetch your shoots.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientShoots();
  }, [toast]);
  
  // Filter shoots by status from the main 'shoots' state
  const scheduledShoots = useMemo(() => shoots.filter(s => s.status === 'scheduled'), [shoots]);
  const completedShoots = useMemo(() => shoots.filter(s => s.status === 'completed'), [shoots]);
  const holdShoots = useMemo(() => shoots.filter(s => ['hold', 'pending'].includes(s.status)), [shoots]);

  // Dynamically generate the list of unique photographers from fetched data
  const photographers = useMemo(() => {
    const photographerMap = new Map<string, { name: string }>();
    shoots.forEach(shoot => {
        if (shoot.photographer && shoot.photographer.name) {
            photographerMap.set(shoot.photographer.name, { name: shoot.photographer.name });
        }
    });
    return Array.from(photographerMap.values());
  }, [shoots]);

  // Apply filters to scheduled shoots
  const filteredScheduledShoots = useMemo(() => scheduledShoots.filter(shoot => {
    const matchesAddress = !filterAddress || shoot.location.fullAddress.toLowerCase().includes(filterAddress.toLowerCase());
    const matchesPhotographer = !filterPhotographer || shoot.photographer.name === filterPhotographer;
    return matchesAddress && matchesPhotographer;
  }), [scheduledShoots, filterAddress, filterPhotographer]);

  const handleBookNewShoot = () => {
    navigate('/book-shoot');
  };

  const formatShootDate = (dateString: string) => {
    if (!dateString) return 'Not Scheduled';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Render functions (renderShootCard, renderScheduledShootsTable, etc.) remain the same
  // as they correctly consume the filtered data arrays.
  
  const renderShootCard = (shoot: ShootData) => (
    <motion.div
      // ... (keep animation props)
      key={shoot.id}
      className="p-4 border border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
      onClick={() => handleViewDetails(shoot)} // MODIFY THIS LINE
    >
      {/* ... (keep the entire inner content of the card, it doesn't need to change) */}
       <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="font-medium">{shoot.location.address}</h3>
                <p className="text-sm text-muted-foreground">{shoot.location.city}, {shoot.location.state} {shoot.location.zip}</p>
            </div>
            <Badge
                variant="outline"
                className={`${statusColors[shoot.status] || 'bg-gray-500'} text-white border-none`}
            >
                {shoot.status.charAt(0).toUpperCase() + shoot.status.slice(1)}
            </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatShootDate(shoot.scheduledDate)}</span>
            </div>
            
            {shoot.time && (
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{shoot.time}</span>
                </div>
            )}
            
            {shoot.photographer && (
                <div className="flex items-center gap-2 col-span-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">Photographer: {shoot.photographer.name}</span>
                </div>
            )}
        </div>
        
        <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="gap-1 pointer-events-none">
                <span>View Details</span>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    </motion.div>
  );

   const renderScheduledShootsTable = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {/* ... (keep TableHeader content) */}
        </TableHeader>
        <TableBody>
          {filteredScheduledShoots.length > 0 ? (
            filteredScheduledShoots.map((shoot) => (
              <TableRow key={shoot.id} className="cursor-pointer" onClick={() => handleViewDetails(shoot)}>
                {/* ... (keep the TableCell for Date, Time, Address, etc.) */}
                 <TableCell>{formatShootDate(shoot.scheduledDate)}</TableCell>
                  <TableCell>{shoot.time || 'Not set'}</TableCell>
                  <TableCell className="max-w-xs truncate">{shoot.location.fullAddress}</TableCell>
                  <TableCell>{shoot.services.join(', ')}</TableCell>
                  <TableCell>{shoot.photographer.name}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from firing too
                        handleViewDetails(shoot);
                    }} // MODIFY THIS LINE
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <p>No scheduled shoots found.</p>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderEmptyState = (message: string) => (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
      <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">No shoots to display</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      <Button onClick={handleBookNewShoot}>Book a New Shoot</Button>
    </div>
  );
  
  const renderLoadingState = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-end mt-4">
              <Skeleton className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Shoots</h1>
            <p className="text-muted-foreground">View and manage your property photo shoots</p>
          </div>
          <Button onClick={handleBookNewShoot}>Book New Shoot</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
                <TabsTrigger value="scheduled">Scheduled ({scheduledShoots.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedShoots.length})</TabsTrigger>
                <TabsTrigger value="hold">Hold-On ({holdShoots.length})</TabsTrigger>
            </TabsList>

          {isLoading ? renderLoadingState() : (
            <>
              <TabsContent value="scheduled" className="mt-0">
                {scheduledShoots.length > 0 ? (
                  <>
                    <Collapsible
                      open={isFilterOpen}
                      onOpenChange={setIsFilterOpen}
                      className="mb-6 border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Filter Shoots</h3>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            {isFilterOpen ? "Hide Filters" : "Show Filters"}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address-filter">Address</Label>
                            <Input
                              id="address-filter"
                              placeholder="Filter by address"
                              value={filterAddress}
                              onChange={(e) => setFilterAddress(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="photographer-filter">Photographer</Label>
                            <Select
                              value={filterPhotographer}
                              onValueChange={setFilterPhotographer}
                            >
                              <SelectTrigger id="photographer-filter">
                                <SelectValue placeholder="Select photographer" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All Photographers</SelectItem>
                                {photographers.map((p) => (
                                  <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {(filterAddress || filterPhotographer) && (
                          <div className="flex justify-between items-center mt-4">
                            <p className="text-sm text-muted-foreground">
                              Showing {filteredScheduledShoots.length} of {scheduledShoots.length} shoots
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setFilterAddress('');
                                setFilterPhotographer('');
                              }}
                            >
                              Clear Filters
                            </Button>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                    {renderScheduledShootsTable()}
                  </>
                ) : renderEmptyState("You don't have any scheduled shoots. Book one now!")}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                {completedShoots.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">{completedShoots.map(renderShootCard)}</div>
                ) : renderEmptyState("You don't have any completed shoots yet.")}
              </TabsContent>
              
              <TabsContent value="hold" className="mt-0">
                {holdShoots.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">{holdShoots.map(renderShootCard)}</div>
                ) : renderEmptyState("You don't have any shoots on hold.")}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <ShootDetailDialog 
        shoot={selectedShoot}
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </DashboardLayout>
  );
};

export default ShootHistory;