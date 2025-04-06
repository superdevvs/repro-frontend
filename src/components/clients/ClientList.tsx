
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientTable } from '@/components/clients/ClientTable';
import { ClientCards } from '@/components/clients/ClientCards';
import { ClientPagination } from '@/components/clients/ClientPagination';
import { Client } from '@/types/clients';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClientListProps {
  filteredClients: Client[];
  searchTerm: string;
  onClientSelect: (client: Client) => void;
  onEditClient: (client: Client, e: React.MouseEvent) => void;
  onBookShoot: (client: Client, e: React.MouseEvent) => void;
  onClientPortal: (client: Client, e: React.MouseEvent) => void;
  onDeleteClient: (client: Client, e: React.MouseEvent) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  filteredClients,
  searchTerm,
  onClientSelect,
  onEditClient,
  onBookShoot,
  onClientPortal,
  onDeleteClient
}) => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);

  // Set number of clients per page based on screen size
  const clientsPerPage = isMobile ? 10 : 12;
  
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  return (
    <Card className="glass-card">
      <CardHeader className="px-4 py-3 sm:p-6">
        <CardTitle>Client Directory</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isMobile ? (
          <ClientCards 
            clients={currentClients}
            onSelect={onClientSelect}
            onEdit={onEditClient}
            onBookShoot={onBookShoot}
            onClientPortal={onClientPortal}
            onDelete={onDeleteClient}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        ) : (
          <>
            <ClientTable 
              clients={currentClients}
              onSelect={onClientSelect}
              onEdit={onEditClient}
              onBookShoot={onBookShoot}
              onClientPortal={onClientPortal}
              onDelete={onDeleteClient}
            />
            {filteredClients.length > clientsPerPage && (
              <ClientPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
