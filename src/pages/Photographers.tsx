
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CameraIcon, MapPinIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/layout/PageTransition';

// Mock data for photographers
const photographers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://ui.shadcn.com/avatars/01.png',
    location: 'Baltimore, MD',
    rating: 4.8,
    shootsCompleted: 147,
    specialties: ['Residential', 'Commercial', 'Aerial'],
    status: 'available',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://ui.shadcn.com/avatars/02.png',
    location: 'Washington, DC',
    rating: 4.9,
    shootsCompleted: 213,
    specialties: ['Residential', 'Virtual Tours', 'Twilight'],
    status: 'busy',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://ui.shadcn.com/avatars/03.png',
    location: 'Arlington, VA',
    rating: 4.7,
    shootsCompleted: 98,
    specialties: ['Commercial', 'Aerial', '3D Tours'],
    status: 'available',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://ui.shadcn.com/avatars/04.png',
    location: 'Bethesda, MD',
    rating: 4.6,
    shootsCompleted: 76,
    specialties: ['Residential', 'HDR', 'Drone'],
    status: 'offline',
  },
];

const Photographers = () => {
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Photographers
              </Badge>
              <h1 className="text-3xl font-bold">Photographer Directory</h1>
              <p className="text-muted-foreground">
                Manage photographers and their availability
              </p>
            </div>
            
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Photographer
            </Button>
          </div>
          
          {/* Search and filter */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search photographers..." 
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">All</Button>
                  <Button variant="outline" size="sm">Available</Button>
                  <Button variant="outline" size="sm">Busy</Button>
                  <Button variant="outline" size="sm">Offline</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Photographers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photographers.map((photographer) => (
              <Card key={photographer.id} className="glass-card overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={photographer.avatar} alt={photographer.name} />
                        <AvatarFallback>{photographer.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{photographer.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPinIcon className="h-3 w-3" />
                          <span>{photographer.location}</span>
                        </div>
                      </div>
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
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="font-medium">{photographer.rating}/5.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shoots</span>
                        <span className="font-medium">{photographer.shootsCompleted}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {photographer.specialties.map((specialty) => (
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
                    <Button size="sm">View Profile</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Photographers;
