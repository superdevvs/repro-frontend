
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
      className="rounded-xl overflow-hidden border border-[#403E43] shadow-xl glass-morphism"
      style={{
        background:
          "linear-gradient(111.4deg, #1A1F2C 0%, #403E43 100%)",
        boxShadow: "0 12px 48px rgba(44, 38, 87, 0.3), 0 1.5px 0 #403E43"
      }}
    >
      {!isConversationsCollapsed && (
        <>
          <ResizablePanel 
            defaultSize={25} 
            minSize={15}
            maxSize={40}
            className="bg-gradient-to-b from-[#26293B] to-[#1A1F2C] border-r border-[#403E43] shadow-glass-card"
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
        className="bg-[#1A1F2C] dark:bg-[#1A1F2C]/95 backdrop-blur-lg"
      >
        <div className="flex flex-col h-full text-[#ccc]">
          {selectedConversation && currentConversation ? (
            <>
              <MessageHeader 
                conversation={currentConversation}
                isConversationsCollapsed={isConversationsCollapsed}
                toggleConversations={toggleConversations}
              />
              
              <div className="flex-1 flex flex-col overflow-hidden border-t border-[#403E43]">
                <MessageList 
                  messages={currentMessages} 
                  currentUserId="me"
                  onMarkAsTask={onMarkAsTask}
                  selectedMessageId={selectedMessageId}
                />
                
                <MessageInput 
                  onSendMessage={onSendMessage}
                  templates={messageTemplates}
                  className="bg-[#26293B]"
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
            className="hidden md:block border-l border-[#403E43] bg-gradient-to-br from-[#2C2657] to-[#1A1F2C]"
          >
            <ProjectContextBar 
              conversation={currentConversation}
              className="p-5 glass-morphism text-[#ddd]"
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
