
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';
import { useShoots } from '@/context/ShootsContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { ClientStats } from '@/components/clients/ClientStats';
import { ClientSearch } from '@/components/clients/ClientSearch';
import { ClientTable } from '@/components/clients/ClientTable';
import { ClientCards } from '@/components/clients/ClientCards';
import { ClientPagination } from '@/components/clients/ClientPagination';
import { ClientDetails } from '@/components/clients/ClientDetails';
import { ClientForm, ClientFormData } from '@/components/clients/ClientForm';

const Clients = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { shoots } = useShoots();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 8;
  
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
  
  const totalClients = clientsData.length;
  const activeClients = clientsData.filter(client => client.status === 'active').length;
  const totalShoots = shoots.length;
  const averageShootsPerClient = totalClients > 0 
    ? Math.round((totalShoots / totalClients) * 10) / 10 
    : 0;
  
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  // Update clients with shoot data
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
  
  // Save clients to localStorage
  useEffect(() => {
    localStorage.setItem('clientsData', JSON.stringify(clientsData));
  }, [clientsData]);
  
  const filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  
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
    <DashboardLayout>
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
          
          <ClientStats 
            totalClients={totalClients}
            activeClients={activeClients}
            totalShoots={totalShoots}
            averageShootsPerClient={averageShootsPerClient}
          />
          
          <ClientSearch 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!isMobile ? (
                <>
                  <ClientTable 
                    clients={currentClients}
                    onSelect={handleClientSelect}
                    onEdit={handleEditClient}
                    onBookShoot={handleBookShoot}
                    onClientPortal={handleClientPortal}
                    onDelete={handleDeleteClient}
                  />
                  {filteredClients.length > clientsPerPage && (
                    <ClientPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <ClientCards 
                  clients={currentClients}
                  onSelect={handleClientSelect}
                  onEdit={handleEditClient}
                  onBookShoot={handleBookShoot}
                  onClientPortal={handleClientPortal}
                  onDelete={handleDeleteClient}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
      
      <ClientDetails 
        client={selectedClient}
        open={clientDetailsOpen}
        onOpenChange={setClientDetailsOpen}
        onEdit={handleEditClient}
        onBookShoot={handleBookShoot}
      />

      <ClientForm
        open={clientFormOpen}
        onOpenChange={setClientFormOpen}
        formData={clientFormData}
        setFormData={setClientFormData}
        isEditing={isEditing}
        showUploadOptions={showUploadOptions}
        setShowUploadOptions={setShowUploadOptions}
        onSubmit={handleClientFormSubmit}
      />
    </DashboardLayout>
  );
};

export default Clients;
