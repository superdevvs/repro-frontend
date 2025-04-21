
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
      className="rounded-lg overflow-hidden border"
    >
      {!isConversationsCollapsed && (
        <>
          <ResizablePanel 
            defaultSize={25} 
            minSize={15}
            maxSize={40}
            className="bg-white dark:bg-slate-900 border-r"
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
        className="bg-white dark:bg-slate-900"
      >
        <div className="flex flex-col h-full">
          {selectedConversation && currentConversation ? (
            <>
              <MessageHeader 
                conversation={currentConversation}
                isConversationsCollapsed={isConversationsCollapsed}
                toggleConversations={toggleConversations}
              />
              
              <div className="flex-1 flex flex-col overflow-hidden border-t">
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
            className="hidden md:block border-l bg-white dark:bg-slate-900"
          >
            <ProjectContextBar 
              conversation={currentConversation}
              className="p-5"
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
