
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ConversationFilter } from '@/types/messages';
import { FoldersSection } from './message-menu/FoldersSection';
import { LabelsSection } from './message-menu/LabelsSection';
import { FilterOptionsSection } from './message-menu/FilterOptionsSection';

interface MessagesMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    showFolders: boolean;
    setShowFolders: (show: boolean) => void;
    folders: { id: string; name: string; count: number }[];
    labels: { id: string; name: string; color: string }[];
    filter: ConversationFilter;
    onFilterChange: (filter: ConversationFilter) => void;
  };
}

export function MessagesMobileMenu({ isOpen, onClose, filters }: MessagesMobileMenuProps) {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  // Animation variants for the modal
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  if (!isOpen) return null;

  const { 
    showFolders, 
    setShowFolders, 
    folders, 
    labels, 
    filter, 
    onFilterChange 
  } = filters;

  const handleClearFilters = () => {
    onFilterChange({
      searchQuery: '',
      serviceType: undefined,
      status: undefined,
      userType: undefined,
      dateRange: 'all'
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={backdropVariants}
      onClick={onClose}
    >
      <motion.div 
        className={cn(
          "absolute bottom-16 left-0 right-0 mx-4 rounded-xl overflow-hidden",
          isLightMode 
            ? "bg-white border border-gray-200 shadow-lg" 
            : "bg-background border border-border shadow-xl"
        )}
        variants={menuVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b flex items-center justify-between">
          <h3 className="font-medium">Message Filters</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-[60vh] overflow-y-auto">
          <div className="p-3">
            <FoldersSection 
              showFolders={showFolders}
              setShowFolders={setShowFolders}
              folders={folders}
            />
            
            <Separator className="my-3" />
            
            <LabelsSection labels={labels} />
            
            <Separator className="my-3" />
            
            <FilterOptionsSection 
              filter={filter}
              onFilterChange={onFilterChange}
            />
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-center text-xs mt-2"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}
