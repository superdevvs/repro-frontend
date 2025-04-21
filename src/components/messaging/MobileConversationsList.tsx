
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
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Messages
          </h2>
          <Button variant="outline" size="sm" className="rounded-full">
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-3 border-b flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-9"
            value={filter.searchQuery}
            onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex bg-muted rounded-md p-1 flex-1">
            <button
              onClick={() => setActiveTab('inbox')}
              className={cn(
                "flex-1 px-3 py-1 text-xs font-medium rounded-sm transition-colors",
                activeTab === 'inbox' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground"
              )}
            >
              Primary
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={cn(
                "flex-1 px-3 py-1 text-xs font-medium rounded-sm transition-colors",
                activeTab === 'archived' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground"
              )}
            >
              Archive
            </button>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 h-8 w-8 p-0"
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
              "cursor-pointer p-3 border-b hover:bg-muted/50 transition-colors",
              selectedConversation === conversation.id && "bg-muted"
            )}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.participant.avatar} />
                <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "font-medium truncate",
                    conversation.unreadCount > 0 && "font-semibold"
                  )}>
                    {conversation.participant.name}
                  </p>
                  <p className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                    {format(new Date(conversation.timestamp), 'h:mm a')}
                  </p>
                </div>
                
                {conversation.shoot && (
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.shoot.title}
                  </p>
                )}
                
                <p className={cn(
                  "text-sm truncate mt-0.5",
                  conversation.unreadCount > 0 ? "font-semibold" : "text-muted-foreground"
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
