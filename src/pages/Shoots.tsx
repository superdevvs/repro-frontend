
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { ShootCard } from '@/components/dashboard/ShootCard';
import { ShootsList } from '@/components/dashboard/ShootsList';
import { ShootDetail } from '@/components/dashboard/ShootDetail';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CameraIcon, 
  LayoutGrid, 
  List, 
  PlusCircle, 
  SearchIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { ShootData } from '@/types/shoots';
import { shootsData } from '@/data/shootsData';

const Shoots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { role } = useAuth();
  const navigate = useNavigate();
  
  // Filter shoots based on search term and selected tab
  const filteredShoots = shootsData.filter(shoot => {
    const matchesSearch = 
      shoot.location.fullAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoot.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoot.photographer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'scheduled') return matchesSearch && shoot.status === 'scheduled';
    if (selectedTab === 'completed') return matchesSearch && shoot.status === 'completed';
    if (selectedTab === 'pending') return matchesSearch && shoot.status === 'pending';
    if (selectedTab === 'hold') return matchesSearch && shoot.status === 'hold';
    return false;
  });
  
  const handleShootSelect = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsDetailOpen(true);
  };
  
  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedShoot(null);
  };
  
  // Convert ShootData to ShootCard props
  const mapShootToCardProps = (shoot: ShootData) => ({
    id: shoot.id,
    address: shoot.location.fullAddress,
    date: shoot.scheduledDate,
    time: "10:00 AM - 12:00 PM", // This should come from the actual data
    photographer: {
      name: shoot.photographer.name,
      avatar: shoot.photographer.avatar || "https://ui.shadcn.com/avatars/01.png", // Default avatar
    },
    client: {
      name: shoot.client.name,
    },
    status: shoot.status as any,
    price: shoot.payment.totalQuote,
    delay: 0,
  });
  
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
            
            {['admin', 'superadmin'].includes(role) && (
              <Button onClick={() => navigate('/book-shoot')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Book New Shoot
              </Button>
            )}
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
                
                <div className="flex items-center gap-2 flex-wrap">
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
                  <Button 
                    variant={selectedTab === 'hold' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedTab('hold')}
                  >
                    Hold
                  </Button>
                  
                  <div className="ml-auto flex border rounded-md overflow-hidden">
                    <Button 
                      variant={viewMode === 'grid' ? 'subtle' : 'ghost'} 
                      size="sm" 
                      className="rounded-none"
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'subtle' : 'ghost'} 
                      size="sm" 
                      className="rounded-none"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Shoots view */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredShoots.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredShoots.map((shoot, index) => (
                    <ShootCard
                      key={shoot.id}
                      {...mapShootToCardProps(shoot)}
                      delay={index}
                      onClick={() => handleShootSelect(shoot)}
                    />
                  ))}
                </div>
              ) : (
                <ShootsList 
                  shoots={filteredShoots}
                  onViewDetails={handleShootSelect}
                />
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <CameraIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No shoots found</h3>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Shoot detail dialog */}
        <ShootDetail 
          shoot={selectedShoot}
          isOpen={isDetailOpen}
          onClose={closeDetail}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default Shoots;
