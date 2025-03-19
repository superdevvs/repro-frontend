
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertCircleIcon, 
  CalendarIcon, 
  CameraIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  DollarSignIcon, 
  DownloadIcon, 
  ExternalLinkIcon, 
  FilterIcon, 
  HomeIcon, 
  MapPinIcon, 
  PhoneIcon, 
  SearchIcon, 
  UserIcon, 
  UsersIcon, 
  XIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { shootsData, ShootData } from '@/data/shootsData';
import { format } from 'date-fns';
import { PageTransition } from '@/components/layout/PageTransition';

const Shoots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('table');
  const { role } = useAuth();
  
  const filteredShoots = shootsData.filter(shoot => {
    const matchesSearch = 
      shoot.address.fullAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoot.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoot.photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shoot.client.email && shoot.client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shoot.services.join(', ').toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'scheduled') return matchesSearch && shoot.status === 'scheduled';
    if (selectedTab === 'completed') return matchesSearch && shoot.status === 'completed';
    return false;
  });
  
  const handleShootSelect = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsDialogOpen(true);
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Shoots
              </Badge>
              <h1 className="text-3xl font-bold">Property Shoots</h1>
              <p className="text-muted-foreground">
                Manage and track all property photoshoot sessions.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => setView('grid')} 
                variant={view === 'grid' ? 'default' : 'outline'}
              >
                Grid
              </Button>
              <Button 
                size="sm" 
                onClick={() => setView('table')} 
                variant={view === 'table' ? 'default' : 'outline'}
              >
                Table
              </Button>
            </div>
          </div>
          
          {/* Search and filter */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by address, client, photographer, or services..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-nowrap">
                  <Button 
                    variant={selectedTab === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTab('all')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={selectedTab === 'scheduled' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTab('scheduled')}
                  >
                    Scheduled
                  </Button>
                  <Button 
                    variant={selectedTab === 'completed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTab('completed')}
                  >
                    Completed
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Shoots display based on view type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredShoots.length > 0 ? (
                  filteredShoots.map((shoot, index) => (
                    <ShootCard
                      key={shoot.id}
                      shoot={shoot}
                      delay={index}
                      onClick={() => handleShootSelect(shoot)}
                    />
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <CameraIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No shoots found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[120px]">Scheduled</TableHead>
                          <TableHead className="w-[120px]">Completed</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Photographer</TableHead>
                          <TableHead>Services</TableHead>
                          <TableHead className="text-right">Quote</TableHead>
                          <TableHead className="text-right">Paid</TableHead>
                          <TableHead className="text-center w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredShoots.length > 0 ? (
                          filteredShoots.map((shoot) => (
                            <TableRow 
                              key={shoot.id}
                              className="cursor-pointer"
                              onClick={() => handleShootSelect(shoot)}
                            >
                              <TableCell className="font-medium">{shoot.scheduled}</TableCell>
                              <TableCell>{shoot.completed || '-'}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">{shoot.client.name}</span>
                                  <span className="text-xs text-muted-foreground">{shoot.client.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="truncate max-w-[200px]">{shoot.address.street}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {shoot.address.city}, {shoot.address.state} {shoot.address.zip}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>{shoot.photographer.name}</TableCell>
                              <TableCell>
                                <div className="max-w-[200px] truncate">
                                  {shoot.services.join(', ')}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(shoot.pricing.totalQuote)}
                              </TableCell>
                              <TableCell className="text-right">
                                {shoot.pricing.totalPaid ? (
                                  <span className="text-green-600">{formatCurrency(shoot.pricing.totalPaid)}</span>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <ExternalLinkIcon className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={9} className="h-24 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <CameraIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-muted-foreground">No shoots found</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
        
        {/* Shoot details dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            {selectedShoot && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <DialogTitle>Shoot Details</DialogTitle>
                    <Badge className={
                      selectedShoot.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      selectedShoot.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }>
                      {selectedShoot.status.charAt(0).toUpperCase() + selectedShoot.status.slice(1)}
                    </Badge>
                  </div>
                  <DialogDescription>
                    ID: #{selectedShoot.id}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Client Information</h3>
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                          <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Client Name</h4>
                            <p className="text-muted-foreground">{selectedShoot.client.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MailIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Email</h4>
                            <p className="text-muted-foreground">{selectedShoot.client.email}</p>
                          </div>
                        </div>
                        
                        {selectedShoot.client.phone && (
                          <div className="flex items-start gap-3">
                            <PhoneIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <h4 className="font-medium">Phone</h4>
                              <p className="text-muted-foreground">{selectedShoot.client.phone}</p>
                            </div>
                          </div>
                        )}
                        
                        {selectedShoot.client.company && (
                          <div className="flex items-start gap-3">
                            <BuildingIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <h4 className="font-medium">Company</h4>
                              <p className="text-muted-foreground">{selectedShoot.client.company}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-start gap-3">
                          <CameraIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Total Shoots</h4>
                            <p className="text-muted-foreground">{selectedShoot.client.totalShoots || 1}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Property Information</h3>
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                          <HomeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Address</h4>
                            <p className="text-muted-foreground">{selectedShoot.address.street}</p>
                            {selectedShoot.address.street2 && (
                              <p className="text-muted-foreground">{selectedShoot.address.street2}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Location</h4>
                            <p className="text-muted-foreground">
                              {selectedShoot.address.city}, {selectedShoot.address.state} {selectedShoot.address.zip}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Schedule</h4>
                            <p className="text-muted-foreground">
                              Scheduled: {selectedShoot.scheduled}
                              {selectedShoot.completed && (
                                <span> • Completed: {selectedShoot.completed}</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <CameraIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h4 className="font-medium">Photographer</h4>
                            <p className="text-muted-foreground">{selectedShoot.photographer.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Shoot Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">Services</h4>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedShoot.services.map((service, idx) => (
                              <Badge key={idx} variant="secondary" className="font-normal">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {selectedShoot.notes && (
                          <div>
                            <h4 className="font-medium">Notes</h4>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {selectedShoot.notes.shootNotes && (
                                <p>Shoot Notes: {selectedShoot.notes.shootNotes}</p>
                              )}
                              {selectedShoot.notes.photographerNotes && (
                                <p>Photographer Notes: {selectedShoot.notes.photographerNotes}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium">Pricing</h4>
                          <div className="mt-2 space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Base Quote:</span>
                              <span>{formatCurrency(selectedShoot.pricing.baseQuote)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tax ({selectedShoot.pricing.tax}%):</span>
                              <span>{formatCurrency(selectedShoot.pricing.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Total Quote:</span>
                              <span>{formatCurrency(selectedShoot.pricing.totalQuote)}</span>
                            </div>
                            
                            {selectedShoot.pricing.totalPaid && (
                              <>
                                <div className="border-t pt-1 mt-1">
                                  <div className="flex justify-between text-green-600 font-medium">
                                    <span>Total Paid:</span>
                                    <span>{formatCurrency(selectedShoot.pricing.totalPaid)}</span>
                                  </div>
                                  {selectedShoot.pricing.lastPaymentDate && (
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>Last Payment:</span>
                                      <span>
                                        {selectedShoot.pricing.lastPaymentDate} 
                                        {selectedShoot.pricing.lastPaymentType && ` (${selectedShoot.pricing.lastPaymentType})`}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {selectedShoot.createdBy && (
                          <div>
                            <h4 className="font-medium">Created By</h4>
                            <p className="text-sm text-muted-foreground">{selectedShoot.createdBy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                    {['admin', 'superadmin'].includes(role) && (
                      <>
                        <Button className="w-full sm:w-auto">Edit Shoot</Button>
                        <Button variant="outline" className="w-full sm:w-auto">Generate Invoice</Button>
                        <Button variant="outline" className="w-full sm:w-auto">
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </>
                    )}
                    
                    {role === 'photographer' && (
                      <>
                        <Button className="w-full sm:w-auto">Upload Media</Button>
                        <Button variant="outline" className="w-full sm:w-auto">Manage Notes</Button>
                        <Button variant="outline" className="w-full sm:w-auto">Get Directions</Button>
                      </>
                    )}
                    
                    {role === 'client' && (
                      <>
                        <Button className="w-full sm:w-auto">View Media</Button>
                        <Button variant="outline" className="w-full sm:w-auto">Get Directions</Button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
};

// Helper component for mail icon
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// Helper component for building icon
const BuildingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01" />
    <path d="M16 6h.01" />
    <path d="M12 6h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
    <path d="M16 10h.01" />
    <path d="M16 14h.01" />
    <path d="M8 10h.01" />
    <path d="M8 14h.01" />
  </svg>
);

// ShootCard component for the grid view
interface ShootCardProps {
  shoot: ShootData;
  delay?: number;
  onClick?: () => void;
}

const ShootCard: React.FC<ShootCardProps> = ({ shoot, delay = 0, onClick }) => {
  const statusColors = {
    scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const statusText = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    pending: 'Pending',
    cancelled: 'Cancelled',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="glass-card h-full overflow-hidden cursor-pointer" onClick={onClick}>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <Badge className={`font-normal ${statusColors[shoot.status]}`}>
                {statusText[shoot.status]}
              </Badge>
              <span className="text-sm text-muted-foreground">#{shoot.id}</span>
            </div>
            
            <h3 className="font-medium text-lg mb-2 truncate">{shoot.address.street}</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{shoot.scheduled}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <CameraIcon className="h-4 w-4" />
                <span>{shoot.photographer.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPinIcon className="h-4 w-4" />
                <span className="truncate">
                  {shoot.address.city}, {shoot.address.state} {shoot.address.zip}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSignIcon className="h-4 w-4" />
                <span>${shoot.pricing.totalQuote.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between p-4 bg-secondary/30 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium">Client</p>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{shoot.client.name}</p>
            </div>
          </div>
          
          <Button size="sm" variant="outline">
            Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default Shoots;
