
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageCircle } from 'lucide-react';

interface MessageEmptyStateProps {
  isConversationsCollapsed: boolean;
  toggleConversations: () => void;
}

export function MessageEmptyState({ isConversationsCollapsed, toggleConversations }: MessageEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      {isConversationsCollapsed && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleConversations}
          className="absolute top-4 left-4"
        >
          <ChevronRight className="h-4 w-4 mr-1" />
          <span>Show Conversations</span>
        </Button>
      )}
      <MessageCircle className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
      <h3 className="text-lg font-medium mb-1">No conversation selected</h3>
      <p className="text-sm text-muted-foreground max-w-sm">
        {isConversationsCollapsed 
          ? "Click 'Show Conversations' to view available messages" 
          : "Select a conversation from the list to start messaging"}
      </p>
    </div>
  );
}
