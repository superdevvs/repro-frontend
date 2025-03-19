
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ShootCard } from '@/components/dashboard/ShootCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, CameraIcon, ClockIcon, HomeIcon, MapPinIcon, SearchIcon, UsersIcon, XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';

// Mock data for shoots
const shootsData = [
  {
    id: '001',
    address: '123 Main Street, Anytown, MD 12345',
    date: 'May 15, 2023',
    time: '10:00 AM - 12:00 PM',
    photographer: {
      name: 'John Doe',
      avatar: 'https://ui.shadcn.com/avatars/01.png',
    },
    client: {
      name: 'ABC Properties',
    },
    status: 'scheduled',
    price: 250,
  },
  {
    id: '002',
    address: '456 Park Avenue, Somewhere, VA 23456',
    date: 'May 16, 2023',
    time: '2:00 PM - 4:00 PM',
    photographer: {
      name: 'Jane Smith',
      avatar: 'https://ui.shadcn.com/avatars/02.png',
    },
    client: {
      name: 'XYZ Realty',
    },
    status: 'scheduled',
    price: 350,
  },
  {
    id: '003',
    address: '789 Ocean Drive, Beachtown, DC 34567',
    date: 'May 17, 2023',
    time: '11:00 AM - 1:00 PM',
    photographer: {
      name: 'John Doe',
      avatar: 'https://ui.shadcn.com/avatars/01.png',
    },
    client: {
      name: 'Coastal Properties',
    },
    status: 'pending',
    price: 300,
  },
  {
    id: '004',
    address: '101 River Road, Riverside, MD 45678',
    date: 'May 12, 2023',
    time: '9:00 AM - 11:00 AM',
    photographer: {
      name: 'Jane Smith',
      avatar: 'https://ui.shadcn.com/avatars/02.png',
    },
    client: {
      name: 'River Realty',
    },
    status: 'completed',
    price: 275,
  },
  {
    id: '005',
    address: '202 Mountain View, Heights, VA 56789',
    date: 'May 10, 2023',
    time: '1:00 PM - 3:00 PM',
    photographer: {
      name: 'John Doe',
      avatar: 'https://ui.shadcn.com/avatars/01.png',
    },
    client: {
      name: 'Mountain Homes',
    },
    status: 'completed',
    price: 325,
  },
  {
    id: '006',
    address: '303 Lake Shore Dr, Lakeside, DC 67890',
    date: 'May 18, 2023',
    time: '10:00 AM - 12:00 PM',
    photographer: {
      name: 'Jane Smith',
      avatar: 'https://ui.shadcn.com/avatars/02.png',
    },
    client: {
      name: 'Lakefront Properties',
    },
    status: 'scheduled',
    price: 400,
  },
];

const Shoots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedShoot, setSelectedShoot] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { role } = useAuth();
  
  const filteredShoots = shootsData.filter(shoot => {
    const matchesSearch = shoot.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shoot.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          shoot.photographer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'scheduled') return matchesSearch && shoot.status === 'scheduled';
    if (selectedTab === 'completed') return matchesSearch && shoot.status === 'completed';
    if (selectedTab === 'pending') return matchesSearch && shoot.status === 'pending';
    return false;
  });
  
  const handleShootSelect = (shoot: any) => {
    setSelectedShoot(shoot);
    setIsDialogOpen(true);
  };
  
  return (
    <DashboardLayout>
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
        </div>
        
        {/* Search and filter */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by address, client, or photographer..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
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
                <Button 
                  variant={selectedTab === 'pending' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedTab('pending')}
                >
                  Pending
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Shoots grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShoots.length > 0 ? (
              filteredShoots.map((shoot, index) => (
                <ShootCard
                  key={shoot.id}
                  id={shoot.id}
                  address={shoot.address}
                  date={shoot.date}
                  time={shoot.time}
                  photographer={shoot.photographer}
                  client={shoot.client}
                  status={shoot.status as any}
                  price={shoot.price}
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
        </motion.div>
      </div>
      
      {/* Shoot details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
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
                <div className="grid gap-3">
                  <div className="flex items-start gap-3">
                    <HomeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Property Address</h3>
                      <p className="text-muted-foreground">{selectedShoot.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Date</h3>
                      <p className="text-muted-foreground">{selectedShoot.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Time</h3>
                      <p className="text-muted-foreground">{selectedShoot.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CameraIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Photographer</h3>
                      <p className="text-muted-foreground">{selectedShoot.photographer.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <UsersIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Client</h3>
                      <p className="text-muted-foreground">{selectedShoot.client.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {['admin', 'superadmin'].includes(role) && (
                    <>
                      <Button className="w-full sm:w-auto">Edit Shoot</Button>
                      <Button variant="outline" className="w-full sm:w-auto">Generate Invoice</Button>
                    </>
                  )}
                  
                  {role === 'photographer' && (
                    <>
                      <Button className="w-full sm:w-auto">Upload Media</Button>
                      <Button variant="outline" className="w-full sm:w-auto">Manage Notes</Button>
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
    </DashboardLayout>
  );
};

export default Shoots;
