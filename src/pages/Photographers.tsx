
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CameraIcon, MapPinIcon, PlusIcon, SearchIcon, CalendarIcon, InfoIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/layout/PageTransition';
import { PhotographerForm } from '@/components/photographers/PhotographerForm';
import { PhotographerProfile } from '@/components/photographers/PhotographerProfile';
import { useToast } from '@/hooks/use-toast';
import { useShoots } from '@/context/ShootsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Type for photographer from shoots data
interface PhotographerFromShoots {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  location?: string;
  rating?: number;
  shootsCompleted: number;
  specialties?: string[];
  status: 'available' | 'busy' | 'offline';
}

const Photographers = () => {
  const { toast } = useToast();
  const { shoots } = useShoots();
  const [photographersList, setPhotographersList] = useState<PhotographerFromShoots[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState<PhotographerFromShoots | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Extract photographers from shoots data on component mount
  useEffect(() => {
    const photographersMap = new Map<string, PhotographerFromShoots>();
    
    shoots.forEach(shoot => {
      const { photographer } = shoot;
      
      if (!photographersMap.has(photographer.name)) {
        // Count completed shoots for this photographer
        const completedShoots = shoots.filter(s => 
          s.photographer.name === photographer.name && s.status === 'completed'
        ).length;
        
        photographersMap.set(photographer.name, {
          id: photographer.id || photographer.name.replace(/\s+/g, '-').toLowerCase(),
          name: photographer.name,
          avatar: photographer.avatar || `https://ui.shadcn.com/avatars/0${Math.floor(Math.random() * 5) + 1}.png`,
          shootsCompleted: completedShoots,
          // Random status for demonstration - in a real app, this would come from data
          status: ['available', 'busy', 'offline'][Math.floor(Math.random() * 3)] as 'available' | 'busy' | 'offline',
          // Random specialties - in a real app, these would come from data
          specialties: ['Residential', 'Commercial', 'Aerial', 'HDR', 'Virtual Tours', 'Twilight', '3D Tours', 'Drone']
            .sort(() => 0.5 - Math.random())
            .slice(0, 3),
          // Random rating - in a real app, this would come from data
          rating: (4 + Math.random()).toFixed(1),
          // Random location - in a real app, this would come from data
          location: shoot.location.city + ', ' + shoot.location.state,
        });
      }
    });
    
    setPhotographersList(Array.from(photographersMap.values()));
  }, [shoots]);

  // Filter photographers based on search term and active filter
  const filteredPhotographers = photographersList.filter(photographer => {
    const matchesSearch = 
      photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photographer.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (photographer.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && photographer.status === activeFilter.toLowerCase();
  });

  const handleAddPhotographer = (data: any) => {
    console.log("Adding new photographer with data:", data);
    
    // Create unique ID for new photographer
    const newId = `${Date.now()}`;
    
    const newPhotographer = {
      id: newId,
      name: data.name,
      email: data.email,
      avatar: data.avatar || `https://ui.shadcn.com/avatars/0${Math.floor(Math.random() * 5) + 1}.png`,
      location: data.location,
      rating: 0,
      shootsCompleted: 0,
      specialties: data.specialties,
      status: data.status,
    };
    
    setPhotographersList(prev => [...prev, newPhotographer]);
    setFormOpen(false);
    
    // Display success message
    toast({
      title: 'Photographer Added',
      description: `${data.name} has been added to the directory.`,
    });
  };

  const handleViewProfile = (photographer: PhotographerFromShoots) => {
    setSelectedPhotographer(photographer);
    setProfileOpen(true);
  };

  const handleEditPhotographer = () => {
    setProfileOpen(false);
    setEditOpen(true);
  };

  const handleEditDirectly = (photographer: PhotographerFromShoots) => {
    setSelectedPhotographer(photographer);
    setEditOpen(true);
  };

  const handleUpdatePhotographer = (data: any) => {
    // Update the photographer in the list
    setPhotographersList(prev => 
      prev.map(p => 
        p.id === selectedPhotographer?.id 
          ? { 
              ...p, 
              name: data.name, 
              email: data.email, 
              location: data.location, 
              specialties: data.specialties, 
              status: data.status,
              avatar: data.avatar || p.avatar,
            } 
          : p
      )
    );
    
    setEditOpen(false);
    
    // Display success message
    toast({
      title: 'Photographer Updated',
      description: `${data.name}'s profile has been updated.`,
    });
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Photographers
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight">Photographer Directory</h1>
              <p className="text-muted-foreground">
                Manage photographers and their availability
              </p>
            </div>
            
            <Button className="gap-2 hover:shadow-md transition-shadow" onClick={() => setFormOpen(true)}>
              <PlusIcon className="h-4 w-4" />
              Add Photographer
            </Button>
          </div>
          
          {/* Improved Search and filter */}
          <Card className="glass-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search photographers by name, location or specialty..." 
                    className="pl-9 h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={activeFilter === 'All' ? 'default' : 'outline'} 
                    size="sm"
                    className="font-medium transition-colors"
                    onClick={() => setActiveFilter('All')}
                  >
                    All
                  </Button>
                  <Button 
                    variant={activeFilter === 'available' ? 'default' : 'outline'} 
                    size="sm"
                    className="font-medium text-green-600 bg-green-50 border-green-200 hover:bg-green-100 hover:text-green-700 transition-colors"
                    onClick={() => setActiveFilter('available')}
                  >
                    Available
                  </Button>
                  <Button 
                    variant={activeFilter === 'busy' ? 'default' : 'outline'} 
                    size="sm"
                    className="font-medium text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                    onClick={() => setActiveFilter('busy')}
                  >
                    Busy
                  </Button>
                  <Button 
                    variant={activeFilter === 'offline' ? 'default' : 'outline'} 
                    size="sm"
                    className="font-medium text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    onClick={() => setActiveFilter('offline')}
                  >
                    Offline
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Photographers grid with enhanced UI */}
          {filteredPhotographers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhotographers.map((photographer) => (
                <Card 
                  key={photographer.id} 
                  className="glass-card overflow-hidden hover:shadow-md transition-shadow rounded-lg border border-border animate-fadeIn"
                >
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                          <AvatarImage src={photographer.avatar} alt={photographer.name} />
                          <AvatarFallback>{photographer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-base">{photographer.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPinIcon className="h-3 w-3" />
                            <span>{photographer.location || 'Location not specified'}</span>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge 
                                className={`ml-auto ${
                                  photographer.status === 'available' 
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                    : photographer.status === 'busy' 
                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                                    : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                }`}
                              >
                                {photographer.status === 'available' ? 'Available' : photographer.status === 'busy' ? 'Busy' : 'Offline'}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              {photographer.status === 'available' 
                                ? 'This photographer is available for bookings' 
                                : photographer.status === 'busy' 
                                ? 'This photographer is currently booked' 
                                : 'This photographer is offline'}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <InfoIcon className="h-3.5 w-3.5" />
                            Rating
                          </span>
                          <span className="font-medium">{photographer.rating || '0'}/5.0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <CalendarIcon className="h-3.5 w-3.5" />
                            Shoots
                          </span>
                          <span className="font-medium">{photographer.shootsCompleted}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {photographer.specialties?.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-secondary/30 border-t border-border flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm">
                        <CameraIcon className="h-4 w-4 text-primary" />
                        <span>{photographer.shootsCompleted} shoots</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="hover:bg-accent transition-colors"
                          onClick={() => handleEditDirectly(photographer)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          className="hover:bg-primary/90 transition-colors"
                          onClick={() => handleViewProfile(photographer)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
              <CameraIcon className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">No photographers found</h3>
              <p className="text-gray-500 mb-4 text-center max-w-md">
                {searchTerm 
                  ? `No photographers match your search "${searchTerm}".` 
                  : "There are no photographers matching your filters."}
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setActiveFilter('All');
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </PageTransition>
      
      {/* Add Photographer Form */}
      <PhotographerForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        onSubmit={handleAddPhotographer} 
      />

      {/* View Photographer Profile */}
      <PhotographerProfile
        photographer={selectedPhotographer}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        onEdit={handleEditPhotographer}
      />

      {/* Edit Photographer Form */}
      {selectedPhotographer && (
        <PhotographerForm 
          open={editOpen} 
          onOpenChange={setEditOpen} 
          onSubmit={handleUpdatePhotographer}
          initialData={selectedPhotographer}
        />
      )}
    </DashboardLayout>
  );
};

export default Photographers;
