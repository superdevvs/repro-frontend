
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { ClientStats } from '@/components/clients/ClientStats';
import { ClientSearch } from '@/components/clients/ClientSearch';
import { ClientDetails } from '@/components/clients/ClientDetails';
import { ClientForm } from '@/components/clients/ClientForm';
import { ClientsHeader } from '@/components/clients/ClientsHeader';
import { ClientList } from '@/components/clients/ClientList';
import { useClientsData } from '@/hooks/useClientsData';
import { useClientActions } from '@/hooks/useClientActions';

const Clients = () => {
  const { role } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get client data and stats
  const {
    clientsData,
    setClientsData,
    totalClients,
    activeClients,
    totalShoots,
    averageShootsPerClient
  } = useClientsData();
  
  // Get client action handlers
  const {
    selectedClient,
    clientDetailsOpen,
    setClientDetailsOpen,
    clientFormOpen,
    setClientFormOpen,
    clientFormData,
    setClientFormData,
    isEditing,
    showUploadOptions,
    setShowUploadOptions,
    handleClientSelect,
    handleAddClient,
    handleEditClient,
    handleClientFormSubmit,
    handleDeleteClient,
    handleBookShoot,
    handleClientPortal
  } = useClientActions({
    clientsData,
    setClientsData
  });
  
  // Filter clients based on search term
  const filteredClients = clientsData.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6 px-4 md:px-0">
          <ClientsHeader 
            role={role} 
            handleAddClient={handleAddClient} 
          />
          
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
          
          <ClientList
            filteredClients={filteredClients}
            searchTerm={searchTerm}
            onClientSelect={handleClientSelect}
            onEditClient={handleEditClient}
            onBookShoot={handleBookShoot}
            onClientPortal={handleClientPortal}
            onDeleteClient={handleDeleteClient}
          />
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
