
import React, { useState } from 'react';
import { UserIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ClientCardComponent } from '@/components/clients/ClientCard';
import { Button } from '@/components/ui/button';
import { Client } from '@/types/clients';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Calculate current clients to display (limit to 3 per page for better visibility)
  const cardsPerPage = 2;
  const startIndex = activeIndex * cardsPerPage;
  const visibleClients = clients.slice(startIndex, startIndex + cardsPerPage);
  const maxPages = Math.ceil(clients.length / cardsPerPage);
  
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex(prev => Math.min(prev + 1, maxPages - 1));
  };

  return (
    <div className="p-2 space-y-4">
      {clients.length > 0 ? (
        <>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {visibleClients.map((client) => (
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
            </motion.div>
          </AnimatePresence>
          
          <div className="flex items-center justify-between mt-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrevious}
              disabled={activeIndex === 0}
              className="flex items-center gap-1 px-2 h-8"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="text-xs">Previous</span>
            </Button>
            
            <div className="pagination-indicator">
              {Array.from({ length: maxPages }).map((_, i) => (
                <button
                  key={i}
                  className={`pagination-dot ${activeIndex === i ? 'active' : ''}`}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNext}
              disabled={activeIndex === maxPages - 1}
              className="flex items-center gap-1 px-2 h-8"
            >
              <span className="text-xs">Next</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <div className="bg-muted/20 p-6 rounded-full mb-4">
            <UserIcon className="h-12 w-12 opacity-30" />
          </div>
          <p className="font-medium">No clients found</p>
          <p className="text-sm mt-1 text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};
