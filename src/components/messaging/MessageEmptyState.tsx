
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
      className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-[#EFF5FF]/90 to-[#E5DEFF]/90 dark:from-[#1A1F2C] dark:to-[#403E43] rounded-lg shadow-glass-card relative"
    >
      {isConversationsCollapsed && (
        <Button 
          variant="glass" 
          size="sm" 
          onClick={toggleConversations}
          className="absolute top-4 left-4 border-primary bg-white/60 text-[#6E59A5] shadow-glass-card"
        >
          <ChevronRight className="h-4 w-4 mr-1" />
          <span>Show Conversations</span>
        </Button>
      )}
      <MessageCircle className="h-14 w-14 text-[#A795F7] dark:text-[#D6BCFA] opacity-40 mb-4" />
      <h3 className="text-lg font-medium text-[#7E69AB] mb-1">No conversation selected</h3>
      <p className="text-sm text-[#8E9196] dark:text-[#D6BCFA] max-w-sm">
        {isConversationsCollapsed 
          ? "Click 'Show Conversations' to view available messages" 
          : "Select a conversation from the list to start messaging"}
      </p>
    </div>
  );
}
