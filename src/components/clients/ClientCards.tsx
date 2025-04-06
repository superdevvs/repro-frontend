
import React from 'react';
import { UserIcon } from 'lucide-react';
import { ClientCardComponent } from '@/components/clients/ClientCard';
import { PaginationDots } from '@/components/ui/pagination';
import { Client } from '@/types/clients';

interface ClientCardsProps {
  clients: Client[];
  onSelect: (client: Client) => void;
  onEdit: (client: Client, e: React.MouseEvent) => void;
  onBookShoot: (client: Client, e: React.MouseEvent) => void;
  onClientPortal: (client: Client, e: React.MouseEvent) => void;
  onDelete: (client: Client, e: React.MouseEvent) => void;
  currentPage: number;
  totalPages: number;
}

export const ClientCards: React.FC<ClientCardsProps> = ({
  clients,
  onSelect,
  onEdit,
  onBookShoot,
  onClientPortal,
  onDelete,
  currentPage,
  totalPages
}) => {
  return (
    <div className="p-4 space-y-4">
      {clients.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {clients.map((client) => (
              <ClientCardComponent
                key={client.id}
                client={client}
                onSelect={onSelect}
                onEdit={onEdit}
                onBookShoot={onBookShoot}
                onClientPortal={onClientPortal}
                onDelete={onDelete}
              />
            ))}
          </div>
          
          <PaginationDots 
            currentPage={currentPage} 
            totalPages={totalPages} 
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <UserIcon className="h-12 w-12 mb-3 opacity-20" />
          <p className="font-medium">No clients found</p>
          <p className="text-sm mt-1">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};
