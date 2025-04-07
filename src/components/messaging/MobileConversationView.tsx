
import React from 'react';
import { ChevronLeft, MenuIcon } from 'lucide-react';
import { Conversation, Message } from '@/types/messages';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { ProjectContextBar } from '@/components/messaging/ProjectContextBar';
import { MessageTemplate } from '@/types/messages';

interface MobileConversationViewProps {
  conversation: Conversation;
  messages: Message[];
  isInfoDrawerOpen: boolean;
  setIsInfoDrawerOpen: (isOpen: boolean) => void;
  onBack: () => void;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onMarkAsTask: (message: Message) => void;
  selectedMessageId: string | null;
  templates: MessageTemplate[];
}

export function MobileConversationView({
  conversation,
  messages,
  isInfoDrawerOpen,
  setIsInfoDrawerOpen,
  onBack,
  onSendMessage,
  onMarkAsTask,
  selectedMessageId,
  templates
}: MobileConversationViewProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src={conversation.participant.avatar} />
            <AvatarFallback>{conversation.participant.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-sm font-medium">
              {conversation.participant.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {conversation.participant.role}
            </p>
          </div>
          
          <div className="ml-auto flex items-center">
            <Drawer open={isInfoDrawerOpen} onOpenChange={setIsInfoDrawerOpen}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsInfoDrawerOpen(true)}
              >
                <MenuIcon className="h-4 w-4" />
              </Button>
              
              <DrawerContent className="max-h-[80vh]">
                <ProjectContextBar 
                  conversation={conversation}
                  className="p-4"
                />
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MessageList 
          messages={messages} 
          currentUserId="me"
          onMarkAsTask={onMarkAsTask}
          selectedMessageId={selectedMessageId}
        />
        
        <MessageInput 
          onSendMessage={onSendMessage}
          templates={templates}
        />
      </div>
    </div>
  );
}
