
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
    <div className="py-3 flex justify-between items-center border-b">
      <h1 className="text-xl font-semibold">Messaging Center</h1>
      
      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleConversations}
            className={cn(
              "flex items-center gap-1.5",
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
          
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Message
          </Button>
        </div>
      )}
    </div>
  );
}
