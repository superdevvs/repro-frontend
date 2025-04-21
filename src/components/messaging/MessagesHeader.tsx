
import React from 'react';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessagesHeaderProps {
  isConversationsCollapsed: boolean;
  toggleConversations: () => void;
}

export function MessagesHeader({ isConversationsCollapsed, toggleConversations }: MessagesHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "py-3 flex justify-between items-center border-b",
        "bg-gradient-to-r from-[#E5DEFF]/80 to-[#D3E4FD]/70 dark:from-[#1A1F2C] dark:to-[#403E43]",
        "backdrop-blur-md shadow-glass-card sticky top-0 z-20"
      )}
      style={{
        borderBottom: "1.5px solid rgba(144, 139, 221, 0.12)"
      }}
    >
      <h1 className="text-xl font-semibold text-[#7E69AB] dark:text-[#D6BCFA] drop-shadow-sm">
        Messaging Center
      </h1>
      
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button 
            variant="glass" 
            size="sm"
            onClick={toggleConversations}
            className={cn(
              "flex items-center gap-1.5 border-primary/20 bg-white/40 dark:bg-[#1A1F2C]/60 hover:bg-[#E5DEFF]/80 hover:border-primary/30 text-[#6E59A5] dark:text-[#E5DEFF]",
              isConversationsCollapsed && "border-primary text-primary"
            )}
          >
            {isConversationsCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span>Toggle Sidebar</span>
          </Button>
          
          <Button
            variant="glass"
            className="bg-primary/90 text-white hover:bg-primary dark:bg-[#6E59A5]/70 dark:hover:bg-[#9b87f5]/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      )}
    </div>
  );
}

