import React, { useState, useRef, useEffect } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
  UserIcon,
  UploadIcon,
  CameraIcon,
  X
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';
import { useShoots } from '@/context/ShootsContext';

const Clients = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { shoots } = useShoots();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  type ClientFormData = {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive';
    avatar: string;
  };
  
  const [clientFormData, setClientFormData] = useState<ClientFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    avatar: '',
  });
  
  const [clientsData, setClientsData] = useState<Client[]>(() => {
    const storedClients = localStorage.getItem('clientsData');
    return storedClients ? JSON.parse(storedClients) : initialClientsData;
  });
  
  useEffect(() => {
    if (shoots.length > 0) {
      const clientShootCounts = new Map<string, { count: number, lastDate: string }>();
      
      shoots.forEach(shoot => {
        const clientName = shoot.client.name;
        if (!clientShootCounts.has(clientName)) {
          clientShootCounts.set(clientName, { count: 1, lastDate: shoot.scheduledDate });
        } else {
          const current = clientShootCounts.get(clientName)!;
          current.count++;
          const currentDate = new Date(current.lastDate);
          const shootDate = new Date(shoot.scheduledDate);
          if (shootDate > currentDate) {
            current.lastDate = shoot.scheduledDate;
          }
          clientShootCounts.set(clientName, current);
        }
      });
      
      const updatedClients = clientsData.map(client => {
        const shootData = clientShootCounts.get(client.name);
        if (shootData) {
          return {
            ...client,
            shootsCount: shootData.count,
            lastActivity: shootData.lastDate
          };
        }
        return client;
      });
      
      const existingClientNames = new Set(clientsData.map(c => c.name));
      clientShootCounts.forEach((data, clientName) => {
        if (!existingClientNames.has(clientName)) {
          const clientShoot = shoots.find(s => s.client.name === clientName);
          if (clientShoot) {
            const newClient: Client = {
              id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              name: clientName,
              company: clientShoot.client.company || '',
              email: clientShoot.client.email || '',
              phone: clientShoot.client.phone || '',
              address: '',
              status: 'active',
              shootsCount: data.count,
              lastActivity: data.lastDate
            };
            updatedClients.push(newClient);
          }
        }
      });
      
      setClientsData(updatedClients);
    }
  }, [shoots]);
  
  useEffect(() => {
    localStorage.setItem('clientsData', JSON.stringify(clientsData));
  }, [clientsData]);
  
  const filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientDetailsOpen(true);
  };

  const handleAddClient = () => {
    setIsEditing(false);
    setClientFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      avatar: '',
    });
    setShowUploadOptions(false);
    setClientFormOpen(true);
  };

  const handleEditClient = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
    setClientFormData({
      name: client.name,
      company: client.company || '',
      email: client.email,
      phone: client.phone || '',
      address: client.address || '',
      status: client.status,
      avatar: client.avatar || '',
    });
    setSelectedClient(client);
    setShowUploadOptions(false);
    setClientFormOpen(true);
  };

  const handleClientFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientFormData({
      ...clientFormData,
      [name]: value,
    });
  };

  const handleStatusChange = (value: 'active' | 'inactive') => {
    setClientFormData({
      ...clientFormData,
      status: value
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name, file.type, file.size);
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      const url = URL.createObjectURL(file);
      console.log("Created object URL:", url);
      setClientFormData(prev => ({
        ...prev,
        avatar: url
      }));
      setShowUploadOptions(false);
      
      toast({
        title: 'File uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      console.log("No file selected");
    }
  };

  const handleExternalUpload = (source: 'google-drive' | 'dropbox') => {
    let serviceName = source === 'google-drive' ? 'Google Drive' : 'Dropbox';
    
    toast({
      title: `Connecting to ${serviceName}`,
      description: `Opening ${serviceName} file picker...`,
    });
    
    setTimeout(() => {
      const placeholderUrl = source === 'google-drive'
        ? 'https://ui.shadcn.com/avatars/02.png'
        : 'https://ui.shadcn.com/avatars/03.png';
      
      console.log("Image URL being set:", placeholderUrl);
      setClientFormData(prev => ({
        ...prev,
        avatar: placeholderUrl
      }));
      setShowUploadOptions(false);
      
      toast({
        title: 'File uploaded',
        description: `Image from ${serviceName} has been uploaded successfully.`,
      });
    }, 1500);
  };

  const handleClientFormSubmit = () => {
    if (isEditing && selectedClient) {
      const updatedClients = clientsData.map(client => 
        client.id === selectedClient.id 
          ? { 
              ...client, 
              name: clientFormData.name,
              company: clientFormData.company,
              email: clientFormData.email,
              phone: clientFormData.phone,
              address: clientFormData.address,
              status: clientFormData.status,
              avatar: clientFormData.avatar
            } 
          : client
      );
      
      setClientsData(updatedClients);
      setSelectedClient({
        ...selectedClient,
        name: clientFormData.name,
        company: clientFormData.company,
        email: clientFormData.email,
        phone: clientFormData.phone,
        address: clientFormData.address,
        status: clientFormData.status,
        avatar: clientFormData.avatar
      });
      
      console.log("Updated client data:", clientFormData);
      
      toast({
        title: "Client Updated",
        description: `${clientFormData.name}'s information has been updated successfully.`,
      });
    } else {
      const newClient: Client = {
        id: `${Date.now()}`,
        name: clientFormData.name,
        company: clientFormData.company,
        email: clientFormData.email,
        phone: clientFormData.phone,
        address: clientFormData.address,
        status: clientFormData.status,
        shootsCount: 0,
        lastActivity: new Date().toISOString().split('T')[0],
        avatar: clientFormData.avatar
      };
      
      setClientsData(prevClients => [newClient, ...prevClients]);
      console.log("New client added:", newClient);
      
      toast({
        title: "Client Added",
        description: `${clientFormData.name} has been added successfully.`,
      });
    }
    
    setClientFormOpen(false);
  };

  const handleDeleteClient = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const updatedClients = clientsData.filter(c => c.id !== client.id);
    setClientsData(updatedClients);
    
    if (selectedClient && selectedClient.id === client.id) {
      setClientDetailsOpen(false);
    }
    
    toast({
      title: "Client Removed",
      description: `${client.name} has been removed from your client list.`,
    });
  };

  const handleBookShoot = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (clientDetailsOpen) {
      setClientDetailsOpen(false);
    }
    
    const params = new URLSearchParams();
    params.append('clientId', client.id);
    params.append('clientName', encodeURIComponent(client.name));
    if (client.company) {
      params.append('clientCompany', encodeURIComponent(client.company));
    }
    
    navigate(`/book-shoot?${params.toString()}`);
    
    toast({
      title: "Book Shoot",
      description: `Navigating to book a shoot for ${client.name}...`,
    });
  };

  const handleClientPortal = (client: Client, e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Client Portal",
      description: `Opening client portal for ${client.name}...`,
    });
  };

  return (
    <DashboardLayout className="max-w-full">
      <PageTransition>
        <div className="space-y-6">
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
              <Button className="gap-2" onClick={handleAddClient}>
                <PlusIcon className="h-4 w-4" />
                Add Client
              </Button>
            )}
          </div>
          
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
                      <TableHead>Last Activity</TableHead>
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
                          <TableCell>{new Date(client.lastActivity).toLocaleDateString()}</TableCell>
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
                                <DropdownMenuItem onClick={(e) => handleEditClient(client, e)}>
                                  <EditIcon className="h-4 w-4 mr-2" />
                                  Edit Client
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleBookShoot(client, e)}>
                                  <HomeIcon className="h-4 w-4 mr-2" />
                                  Book Shoot
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleClientPortal(client, e)}>
                                  <ExternalLinkIcon className="h-4 w-4 mr-2" />
                                  Client Portal
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                  onClick={(e) => handleDeleteClient(client, e)}
                                >
                                  <Trash2Icon className="h-4 w-4 mr-2" />
                                  Delete Client
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
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
        </div>
      </PageTransition>
      
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
                        {selectedClient.avatar ? (
                          <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={selectedClient.avatar} alt={selectedClient.name} />
                            <AvatarFallback>
                              {selectedClient.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                            {selectedClient.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                        )}
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
                    <Button variant="outline" onClick={() => handleEditClient(selectedClient)}>Edit Client</Button>
                    <Button onClick={() => handleBookShoot(selectedClient, new Event('click') as unknown as React.MouseEvent)}>Book Shoot</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={clientFormOpen} onOpenChange={setClientFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Client' : 'Add Client'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update client information' : 'Add a new client to your directory'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer border-2 border-border" onClick={() => setShowUploadOptions(true)}>
                  {clientFormData.avatar ? (
                    <AvatarImage src={clientFormData.avatar} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-secondary">
                      <CameraIcon className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full"
                  onClick={() => setShowUploadOptions(true)}
                >
                  <UploadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showUploadOptions && (
              <div className="bg-card border rounded-md p-3 relative">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowUploadOptions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload from device
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                  </div>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExternalUpload('google-drive')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" 
                      alt="Google Drive" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Google Drive
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExternalUpload('dropbox')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/2202px-Dropbox_Icon.svg.png" 
                      alt="Dropbox" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Dropbox
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={clientFormData.name}
                onChange={handleClientFormChange}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Input
                id="company"
                name="company"
                value={clientFormData.company}
                onChange={handleClientFormChange}
                placeholder="Enter company name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={clientFormData.email}
                onChange={handleClientFormChange}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                value={clientFormData.phone}
                onChange={handleClientFormChange}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={clientFormData.address}
                onChange={handleClientFormChange}
                placeholder="Enter address"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status-active"
                    name="status"
                    className="mr-2"
                    checked={clientFormData.status === 'active'}
                    onChange={() => handleStatusChange('active')}
                  />
                  <label htmlFor="status-active">Active</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="status-inactive"
                    name="status"
                    className="mr-2"
                    checked={clientFormData.status === 'inactive'}
                    onChange={() => handleStatusChange('inactive')}
                  />
                  <label htmlFor="status-inactive">Inactive</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setClientFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleClientFormSubmit}>
              {isEditing ? 'Update Client' : 'Add Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Clients;
