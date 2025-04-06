
import React, { useState } from 'react';
import { UserIcon } from 'lucide-react';
import { ClientCardComponent } from '@/components/clients/ClientCard';
import { Client } from '@/types/clients';
import { motion, AnimatePresence } from 'framer-motion';
import { PaginationDots } from '@/components/ui/pagination';

interface ClientCardsProps {
  clients: Client[];
  onSelect: (client: Client) => void;
  onEdit: (client: Client, e: React.MouseEvent) => void;
  onBookShoot: (client: Client, e: React.MouseEvent) => void;
  onClientPortal: (client: Client, e: React.MouseEvent) => void;
  onDelete: (client: Client, e: React.MouseEvent) => void;
}

export const ClientCards: React.FC<ClientCardsProps> = ({
  clients,
  onSelect,
  onEdit,
  onBookShoot,
  onClientPortal,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Show 5 clients per page
  const cardsPerPage = 5;
  const totalPages = Math.ceil(clients.length / cardsPerPage);
  const indexOfLastClient = currentPage * cardsPerPage;
  const indexOfFirstClient = indexOfLastClient - cardsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-2 md:p-4 space-y-4 client-cards-container">
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
                >
                  <ClientCardComponent
                    client={client}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onBookShoot={onBookShoot}
                    onClientPortal={onClientPortal}
                    onDelete={onDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {totalPages > 1 && (
            <div className="fixed bottom-20 left-0 right-0 flex justify-center py-2 z-10">
              <div className="glass-card py-2 px-4 rounded-full">
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
