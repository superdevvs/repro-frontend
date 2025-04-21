
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
        "bg-gradient-to-r from-[#2C2657]/90 to-[#2A2636]/95 dark:from-[#1A1F2C] dark:to-[#403E43]",
        "backdrop-blur-lg shadow-glass-card sticky top-0 z-20 text-[#ccc]"
      )}
      style={{
        borderBottom: "1.5px solid rgba(144, 139, 221, 0.12)"
      }}
    >
      <h1 className="text-xl font-semibold drop-shadow-sm">
        Messaging Center
      </h1>
      
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button 
            variant="glass" 
            size="sm"
            onClick={toggleConversations}
            className={cn(
              "flex items-center gap-1.5 border-primary/20 bg-[#2C2657]/40 hover:bg-[#403E43] hover:border-primary/50 text-[#9b87f5]",
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
            className="bg-[#9b87f5] text-[#1A1F2C] hover:bg-[#8471ce]"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      )}
    </div>
  );
}
