
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  BuildingIcon, 
  EditIcon, 
  ExternalLinkIcon, 
  HomeIcon, 
  MailIcon, 
  PhoneIcon, 
  PlusIcon, 
  SearchIcon, 
  Trash2Icon, 
  UserIcon 
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { TaskManager } from '@/components/dashboard/TaskManager';

// Mock data for clients
const clientsData = [
  {
    id: '1',
    name: 'Jane Smith',
    company: 'XYZ Realty',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    address: '456 Park Avenue, Somewhere, VA 23456',
    status: 'active',
    shootsCount: 45,
    lastActivity: '2023-05-16',
  },
  {
    id: '2',
    name: 'Robert Wilson',
    company: 'Wilson Realty',
    email: 'robert.wilson@example.com',
    phone: '(555) 234-5678',
    address: '789 Ocean Drive, Beachtown, DC 34567',
    status: 'active',
    shootsCount: 12,
    lastActivity: '2023-05-14',
  },
  {
    id: '3',
    name: 'Emily Davis',
    company: 'Davis Properties',
    email: 'emily.davis@example.com',
    phone: '(555) 345-6789',
    address: '101 River Road, Riverside, MD 45678',
    status: 'inactive',
    shootsCount: 23,
    lastActivity: '2023-05-05',
  },
  {
    id: '4',
    name: 'Michael Johnson',
    company: 'Johnson & Associates',
    email: 'michael.johnson@example.com',
    phone: '(555) 456-7890',
    address: '202 Mountain View, Heights, VA 56789',
    status: 'active',
    shootsCount: 18,
    lastActivity: '2023-05-12',
  },
];

const Clients = () => {
  const { role } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  
  // Filter clients based on search term
  const filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle client selection
  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setClientDetailsOpen(true);
  };
  
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
              <h1 className="text-3xl font-bold">Client Management</h1>
              <p className="text-muted-foreground">
                Manage client information and property shoots in the REPro Dashboard
              </p>
            </div>
            
            {['admin', 'superadmin'].includes(role) && (
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Client
              </Button>
            )}
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Clients table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Shoots</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <TableRow key={client.id} className="cursor-pointer hover:bg-secondary/10" onClick={() => handleClientSelect(client)}>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.company}</TableCell>
                          <TableCell>{client.email}</TableCell>
                          <TableCell>{client.phone}</TableCell>
                          <TableCell>{client.shootsCount}</TableCell>
                          <TableCell>
                            <Badge 
                              className={client.status === 'active' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}
                            >
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  handleClientSelect(client);
                                }}>
                                  <UserIcon className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <EditIcon className="h-4 w-4 mr-2" />
                                  Edit Client
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <HomeIcon className="h-4 w-4 mr-2" />
                                  Book Shoot
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                                  Client Portal
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <UserIcon className="h-8 w-8 mb-2 opacity-20" />
                            <p>No clients found</p>
                            <p className="text-sm">Try adjusting your search</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Tasks section */}
          <TaskManager />
        </div>
      </PageTransition>
      
      {/* Client details dialog */}
      <Dialog open={clientDetailsOpen} onOpenChange={setClientDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          
          {selectedClient && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                          {selectedClient.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                        <p className="text-muted-foreground">{selectedClient.company}</p>
                        <Badge 
                          className={`mt-2 ${selectedClient.status === 'active' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}
                        >
                          {selectedClient.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:w-2/3 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MailIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Email</h3>
                            <p className="text-muted-foreground">{selectedClient.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <PhoneIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Phone</h3>
                            <p className="text-muted-foreground">{selectedClient.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <HomeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Address</h3>
                            <p className="text-muted-foreground">{selectedClient.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <BuildingIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <h3 className="font-medium">Company</h3>
                            <p className="text-muted-foreground">{selectedClient.company}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary/20 rounded-md p-3">
                          <p className="text-sm text-muted-foreground">Total Shoots</p>
                          <p className="text-2xl font-bold">{selectedClient.shootsCount}</p>
                        </div>
                        
                        <div className="bg-secondary/20 rounded-md p-3">
                          <p className="text-sm text-muted-foreground">Last Activity</p>
                          <p className="text-2xl font-bold">{new Date(selectedClient.lastActivity).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="flex gap-3 justify-end">
                {['admin', 'superadmin'].includes(role) && (
                  <>
                    <Button variant="outline">Edit Client</Button>
                    <Button>Book Shoot</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Clients;
