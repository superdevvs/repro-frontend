
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '@/types/clients';
import { useToast } from '@/hooks/use-toast';
import { ClientFormData } from '@/components/clients/ClientForm';

interface UseClientActionsProps {
  clientsData: Client[];
  setClientsData: (clients: Client[]) => void;
}

export const useClientActions = ({ clientsData, setClientsData }: UseClientActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const [clientFormOpen, setClientFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  const [clientFormData, setClientFormData] = useState<ClientFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    avatar: '',
  });

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
      
      // Fix TypeScript error by directly setting the clients array
      setClientsData([newClient, ...clientsData]);
      
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

  return {
    selectedClient,
    setSelectedClient,
    clientDetailsOpen,
    setClientDetailsOpen,
    clientFormOpen,
    setClientFormOpen,
    isEditing,
    showUploadOptions,
    setShowUploadOptions,
    clientFormData,
    setClientFormData,
    handleClientSelect,
    handleAddClient,
    handleEditClient,
    handleClientFormSubmit,
    handleDeleteClient,
    handleBookShoot,
    handleClientPortal
  };
};
