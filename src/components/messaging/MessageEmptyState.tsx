
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
      className="flex flex-col items-center justify-center h-full p-12 text-center rounded-xl bg-gradient-to-br from-[#1A1F2C] to-[#403E43] shadow-lg glass-morphism relative"
    >
      {isConversationsCollapsed && (
        <Button 
          variant="glass" 
          size="sm" 
          onClick={toggleConversations}
          className="absolute top-6 left-6 border-primary bg-[#2C2657] text-[#9b87f5] shadow-glass-card hover:bg-[#403E43]"
        >
          <ChevronRight className="h-4 w-4 mr-1" />
          <span>Show Conversations</span>
        </Button>
      )}
      <MessageCircle className="h-16 w-16 text-[#9b87f5] opacity-70 mb-4 drop-shadow-lg" />
      <h3 className="text-2xl font-semibold text-[#9b87f5] mb-2 drop-shadow-md">No conversation selected</h3>
      <p className="text-base text-[#aaa0d8] max-w-xs">
        {isConversationsCollapsed 
          ? "Click 'Show Conversations' to view your messages." 
          : "Select a conversation from the list to get started!"}
      </p>
    </div>
  );
}
