
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
      className="flex flex-col items-center justify-center h-full p-10 md:p-12 text-center glass-morphism bg-gradient-to-br from-[#EFF5FF] to-[#E5DEFF] dark:from-[#201F2B] dark:to-[#403E43] rounded-xl shadow-2xl relative"
    >
      {isConversationsCollapsed && (
        <Button 
          variant="glass" 
          size="sm" 
          onClick={toggleConversations}
          className="absolute top-6 left-6 border-primary 
            bg-white/70 text-[#6E59A5] shadow-glass-card hover:bg-[#E5DEFF]/80"
        >
          <ChevronRight className="h-4 w-4 mr-1" />
          <span>Show Conversations</span>
        </Button>
      )}
      <MessageCircle className="h-16 w-16 text-[#A795F7] dark:text-[#D6BCFA] opacity-40 mb-4 drop-shadow-[0_2px_8px_rgba(123,113,210,0.3)]" />
      <h3 className="text-xl font-semibold text-[#7E69AB] mb-2 drop-shadow">No conversation selected</h3>
      <p className="text-base md:text-lg text-[#8782B4] dark:text-[#d3cafd] max-w-sm">
        {isConversationsCollapsed 
          ? "Click 'Show Conversations' to view your messages." 
          : "Select a conversation from the list to get started!"}
      </p>
    </div>
  );
}
