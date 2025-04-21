import React from 'react';
import { Conversation, Message, MessageTemplate } from '@/types/messages';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ConversationList } from '@/components/messaging/ConversationList';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { ProjectContextBar } from '@/components/messaging/ProjectContextBar';
import { MessageEmptyState } from './MessageEmptyState';
import { MessageHeader } from './MessageHeader';

interface DesktopMessagingLayoutProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  filter: any;
  onFilterChange: (filter: any) => void;
  isConversationsCollapsed: boolean;
  toggleConversations: () => void;
  currentConversation: Conversation | null;
  currentMessages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  onMarkAsTask: (message: Message) => void;
  selectedMessageId: string | null;
  messageTemplates: MessageTemplate[];
}

export function DesktopMessagingLayout({
  conversations,
  selectedConversation,
  onSelectConversation,
  activeTab,
  onTabChange,
  filter,
  onFilterChange,
  isConversationsCollapsed,
  toggleConversations,
  currentConversation,
  currentMessages,
  onSendMessage,
  onMarkAsTask,
  selectedMessageId,
  messageTemplates
}: DesktopMessagingLayoutProps) {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="rounded-xl overflow-hidden border border-[#E5DEFF]/60 shadow-xl glass-morphism"
      style={{
        background:
          "linear-gradient(111.4deg,#f9f8ff 64%,#e5deff 100%)",
        boxShadow: "0 12px 48px rgba(159,140,230,0.09), 0 1.5px 0 #e5deff"
      }}
    >
      {!isConversationsCollapsed && (
        <>
          <ResizablePanel 
            defaultSize={25} 
            minSize={15}
            maxSize={40}
            className="bg-gradient-to-b from-[#F1F0FB]/95 to-[#E5DEFF]/85 
                       dark:from-[#26293B]/90 dark:to-[#201F20]/85 border-r border-[#e5deff] shadow-glass-card"
          >
            <ConversationList 
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={onSelectConversation}
              activeTab={activeTab}
              onTabChange={onTabChange}
              filter={filter}
              onFilterChange={onFilterChange}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
        </>
      )}
      
      <ResizablePanel defaultSize={isConversationsCollapsed ? 65 : 45}
        className="bg-white/85 dark:bg-[#221F26]/95 backdrop-blur-md"
      >
        <div className="flex flex-col h-full">
          {selectedConversation && currentConversation ? (
            <>
              <MessageHeader 
                conversation={currentConversation}
                isConversationsCollapsed={isConversationsCollapsed}
                toggleConversations={toggleConversations}
              />
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <MessageList 
                  messages={currentMessages} 
                  currentUserId="me"
                  onMarkAsTask={onMarkAsTask}
                  selectedMessageId={selectedMessageId}
                />
                
                <MessageInput 
                  onSendMessage={onSendMessage}
                  templates={messageTemplates}
                />
              </div>
            </>
          ) : (
            <MessageEmptyState 
              isConversationsCollapsed={isConversationsCollapsed}
              toggleConversations={toggleConversations}
            />
          )}
        </div>
      </ResizablePanel>
      
      {selectedConversation && currentConversation && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel 
            defaultSize={30}
            minSize={20}
            maxSize={40}
            className="hidden md:block border-l bg-gradient-to-br from-[#EBE6FF]/60 to-[#F1F7FF]/90 dark:from-[#221A29]/80 dark:to-[#26293B]/80"
          >
            <ProjectContextBar 
              conversation={currentConversation}
              className="p-5 glass-morphism"
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
