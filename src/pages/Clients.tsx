
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BuildingIcon, HomeIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/layout/PageTransition';

// Mock data for clients
const clients = [
  {
    id: '1',
    name: 'ABC Properties',
    email: 'contact@abcproperties.com',
    avatar: '/placeholder.svg',
    location: 'Baltimore, MD',
    propertiesListed: 24,
    lastActivity: '2 days ago',
    accountType: 'Agency',
    status: 'active',
  },
  {
    id: '2',
    name: 'XYZ Realty',
    email: 'info@xyzrealty.com',
    avatar: '/placeholder.svg',
    location: 'Washington, DC',
    propertiesListed: 42,
    lastActivity: '5 hours ago',
    accountType: 'Agency',
    status: 'active',
  },
  {
    id: '3',
    name: 'John Smith Homes',
    email: 'john@smithhomes.com',
    avatar: '/placeholder.svg',
    location: 'Arlington, VA',
    propertiesListed: 7,
    lastActivity: '1 week ago',
    accountType: 'Individual',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Coastal Properties',
    email: 'sales@coastalproperties.com',
    avatar: '/placeholder.svg',
    location: 'Annapolis, MD',
    propertiesListed: 18,
    lastActivity: '3 days ago',
    accountType: 'Agency',
    status: 'active',
  },
];

const Clients = () => {
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Clients
              </Badge>
              <h1 className="text-3xl font-bold">Client Directory</h1>
              <p className="text-muted-foreground">
                Manage your real estate clients and their properties
              </p>
            </div>
            
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Add Client
            </Button>
          </div>
          
          {/* Search and filter */}
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search clients..." 
                    className="pl-9"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">All</Button>
                  <Button variant="outline" size="sm">Active</Button>
                  <Button variant="outline" size="sm">Inactive</Button>
                  <Button variant="outline" size="sm">Agency</Button>
                  <Button variant="outline" size="sm">Individual</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Clients grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {clients.map((client) => (
              <Card key={client.id} className="glass-card overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{client.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{client.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BuildingIcon className="h-3 w-3" />
                          <span>{client.accountType}</span>
                        </div>
                      </div>
                      <Badge 
                        className={`ml-auto ${
                          client.status === 'active' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                        }`}
                      >
                        {client.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{client.location}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Active</span>
                        <span className="font-medium">{client.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-secondary/30 border-t border-border flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <HomeIcon className="h-4 w-4 text-primary" />
                      <span>{client.propertiesListed} properties</span>
                    </div>
                    <Button size="sm">View Details</Button>
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

export default Clients;
