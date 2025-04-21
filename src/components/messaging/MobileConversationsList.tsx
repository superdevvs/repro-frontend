
import React from 'react';
import { format } from 'date-fns';
import { Conversation, ConversationFilter } from '@/types/messages';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FilterIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { MessagesMobileMenu } from '@/components/messaging/MessagesMobileMenu';

interface MobileConversationsListProps {
  conversations: Conversation[];
  selectedConversation: string | null; 
  onSelectConversation: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filter: ConversationFilter;
  setFilter: (filter: ConversationFilter) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  showFolders: boolean;
  setShowFolders: (show: boolean) => void;
  folders: { id: string; name: string; count: number }[];
  labels: { id: string; name: string; color: string }[];
}

export function MobileConversationsList({
  conversations,
  selectedConversation,
  onSelectConversation,
  activeTab,
  setActiveTab,
  filter,
  setFilter,
  isMobileMenuOpen,
  toggleMobileMenu,
  showFolders,
  setShowFolders,
  folders,
  labels
}: MobileConversationsListProps) {
  
  const filteredConversations = conversations.filter(convo => 
    convo.participant.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
    (convo.lastMessage.toLowerCase().includes(filter.searchQuery.toLowerCase()))
  );

  return (
    <div className={cn(
      "flex flex-col h-full",
      "bg-gradient-to-br from-[#1A1F2C] to-[#403E43]"
    )}>
      <div className="px-4 py-3 border-b flex-shrink-0"
        style={{
          borderBottom: "1.5px solid rgba(144, 139, 221, 0.12)",
          background: "linear-gradient(90deg, #2C2657 60%, #2A2636 100%)",
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#9b87f5]">
            Messages
          </h2>
          <Button variant="glass" size="sm" className="rounded-full shadow-glass-card bg-[#2A2636]/70 text-[#9b87f5] hover:bg-[#403E43]">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-3 border-b flex-shrink-0 bg-[#1A1F2C]/90"
        style={{ borderBottom: "1.5px solid #403E43" }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b87f5]" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9 bg-[#2A2636] text-[#ccc] border border-[#403E43] focus:ring-primary focus:ring-1"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex bg-[#2A2636]/90 rounded-md p-1 flex-1 border border-[#403E43]">
            <button
              onClick={() => setActiveTab('inbox')}
              className={cn(
                "flex-1 px-3 py-1 text-xs font-medium rounded-sm transition-colors",
                activeTab === 'inbox' 
                  ? "bg-[#9b87f5]/30 text-white" 
                  : "text-[#9b87f5]/70"
              )}
            >
              Primary
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={cn(
                "flex-1 px-3 py-1 text-xs font-medium rounded-sm transition-colors",
                activeTab === 'archived' 
                  ? "bg-[#9b87f5]/30 text-white" 
                  : "text-[#9b87f5]/70"
              )}
            >
              Archive
            </button>
          </div>
          
          <Button 
            variant="glass" 
            size="sm" 
            className="ml-2 h-8 w-8 p-0 border border-[#403E43] bg-[#2A2636] text-[#9b87f5] shadow-glass-card hover:bg-[#403E43]"
            onClick={toggleMobileMenu}
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={cn(
              "cursor-pointer p-3 border-b bg-[#2C2657] hover:bg-[#403E43] transition-colors",
              selectedConversation === conversation.id
                ? "bg-[#403E43] border-l-4 border-[#9b87f5]"
                : "border-b border-[#403E43]"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 shadow-glass-card">
                <AvatarImage src={conversation.participant.avatar} />
                <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "font-medium truncate text-[#9b87f5]",
                    conversation.unreadCount > 0 && "font-semibold text-white"
                  )}>
                    {conversation.participant.name}
                  </p>
                  <p className="text-xs text-[#aaa0d8] whitespace-nowrap ml-1">
                    {format(new Date(conversation.timestamp), 'h:mm a')}
                  </p>
                </div>
                
                {conversation.shoot && (
                  <p className="text-xs text-[#aaa0d8] truncate">
                    {conversation.shoot.title}
                  </p>
                )}
                
                <p className={cn(
                  "text-sm truncate mt-0.5",
                  conversation.unreadCount > 0 ? "font-semibold text-[#ccc]" : "text-[#9b87f5]/80"
                )}>
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MessagesMobileMenu 
            isOpen={isMobileMenuOpen}
            onClose={() => toggleMobileMenu()}
            filters={{
              showFolders,
              setShowFolders,
              folders,
              labels,
              filter,
              onFilterChange: setFilter
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
