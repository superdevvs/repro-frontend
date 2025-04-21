
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, MessageCircle } from 'lucide-react';

interface MessageEmptyStateProps {
  isConversationsCollapsed: boolean;
  toggleConversations: () => void;
}

export function MessageEmptyState({ isConversationsCollapsed, toggleConversations }: MessageEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full p-12 text-center"
    >
      {isConversationsCollapsed && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleConversations}
          className="absolute top-6 left-6"
        >
          <ChevronRight className="h-4 w-4 mr-1" />
          <span>Show Conversations</span>
        </Button>
      )}
      <MessageCircle className="h-16 w-16 text-muted-foreground opacity-50 mb-4" />
      <h3 className="text-2xl font-semibold text-foreground mb-2">No conversation selected</h3>
      <p className="text-base text-muted-foreground max-w-xs">
        {isConversationsCollapsed 
          ? "Click 'Show Conversations' to view your messages." 
          : "Select a conversation from the list to get started!"}
      </p>
    </div>
  );
}
