
import React, { useState } from 'react';
import { UserIcon, ChevronRightIcon, MapPinIcon, PhoneIcon, MailIcon, Building2Icon } from 'lucide-react';
import { ClientCardComponent } from '@/components/clients/ClientCard';
import { Client } from '@/types/clients';
import { motion, AnimatePresence } from 'framer-motion';
import { PaginationDots } from '@/components/ui/pagination';
import { ClientCard, ClientCardHeader, ClientCardContent, ClientCardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ClientCardsProps {
  clients: Client[];
  onSelect: (client: Client) => void;
  onEdit: (client: Client, e: React.MouseEvent) => void;
  onBookShoot: (client: Client, e: React.MouseEvent) => void;
  onClientPortal: (client: Client, e: React.MouseEvent) => void;
  onDelete: (client: Client, e: React.MouseEvent) => void;
  currentPage?: number;
  totalPages?: number;
}

export const ClientCards: React.FC<ClientCardsProps> = ({
  clients,
  onSelect,
  onEdit,
  onBookShoot,
  onClientPortal,
  onDelete,
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  
  // Use external pagination values if provided, otherwise use internal state
  const currentPage = externalCurrentPage || internalCurrentPage;
  const cardsPerPage = isMobile ? 5 : 10;
  const totalPages = externalTotalPages || Math.ceil(clients.length / cardsPerPage);
  
  // If external pagination is not used, apply internal pagination
  const currentClients = externalCurrentPage ? clients : clients.slice(
    (internalCurrentPage - 1) * cardsPerPage, 
    internalCurrentPage * cardsPerPage
  );
  
  const handlePageChange = (page: number) => {
    if (!externalCurrentPage) {
      setInternalCurrentPage(page);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'active': return 'bg-green-500/20 text-green-600';
      case 'inactive': return 'bg-gray-300/30 text-gray-600';
      default: return 'bg-blue-500/20 text-blue-600';
    }
  };

  return (
    <div className="p-4 space-y-4 client-cards-container">
      {clients.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => onSelect(client)}
                  className="cursor-pointer"
                >
                  <ClientCard className="overflow-hidden">
                    <ClientCardHeader className="relative p-0 h-20 bg-gradient-to-r from-primary/5 to-secondary/10">
                      <div className="absolute -bottom-10 left-4">
                        <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                          {client.avatar ? (
                            <AvatarImage src={client.avatar} alt={client.name} />
                          ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                    </ClientCardHeader>
                    
                    <ClientCardContent className="pt-12 pb-3 px-4">
                      <div className="flex flex-col mb-2">
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        {client.company && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Building2Icon className="h-3 w-3" />
                            {client.company}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 mt-2">
                        <div className="client-info-row">
                          <MailIcon className="h-3.5 w-3.5 client-info-icon" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        
                        {client.phone && (
                          <div className="client-info-row">
                            <PhoneIcon className="h-3.5 w-3.5 client-info-icon" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        
                        {client.address && (
                          <div className="client-info-row">
                            <MapPinIcon className="h-3.5 w-3.5 client-info-icon" />
                            <span className="truncate">{client.address}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="text-xs text-muted-foreground">Shoots</span>
                          <p className="font-medium">{client.shootsCount || 0}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => onBookShoot(client, e)}
                            className="text-sm px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                          >
                            Book Shoot
                          </button>
                          <button
                            onClick={(e) => onEdit(client, e)}
                            className="text-sm px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </ClientCardContent>
                  </ClientCard>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {totalPages > 1 && (
            <div className="fixed bottom-20 left-0 right-0 flex justify-center py-2 z-10">
              <div className="glass-card py-2 px-4 rounded-full shadow-md">
                <PaginationDots
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="empty-clients-state">
          <div className="empty-clients-icon">
            <UserIcon className="h-12 w-12 opacity-30" />
          </div>
          <p className="font-medium">No clients found</p>
          <p className="text-sm mt-1 text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};
