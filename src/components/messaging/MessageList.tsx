
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types/messages';
import { groupMessagesByDate, hasNoMessages } from './utils/messageUtils';
import { MessageItem } from './message/MessageItem';
import { MessageDateHeader } from './message/MessageDateHeader';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onMarkAsTask?: (message: Message) => void;
  selectedMessageId?: string | null;
}

export function MessageList({ messages, currentUserId, onMarkAsTask, selectedMessageId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && (!selectedMessageId || selectedMessageId === messages[messages.length - 1]?.id)) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedMessageId]);
  
  // Group messages by date
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <ScrollArea className="h-full">
      {hasNoMessages(messages) ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
          <p>No messages yet</p>
        </div>
      ) : (
        <div>
          {Object.keys(groupedMessages).map((date) => (
            <div key={date} className="border-b last:border-b-0">
              <MessageDateHeader date={date} />
              {groupedMessages[date].map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isSelected={selectedMessageId === message.id}
                  onMarkAsTask={onMarkAsTask}
                />
              ))}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      )}
    </ScrollArea>
  );
}
