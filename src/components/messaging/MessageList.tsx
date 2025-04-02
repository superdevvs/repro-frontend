
import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Paperclip, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message, Attachment } from '@/types/messages';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Format date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };
  
  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = messages.reduce((groups, message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [date: string]: Message[] });
  
  // Format date header
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };
  
  // Render attachment preview
  const renderAttachment = (attachment: Attachment) => {
    const statusIcon = () => {
      switch (attachment.status) {
        case 'final':
          return <CheckCircle className="h-3.5 w-3.5 text-green-500" />;
        case 'needsReview':
          return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
        default:
          return null;
      }
    };
    
    return (
      <div 
        key={attachment.id}
        className="mt-2 rounded-md border overflow-hidden flex flex-col"
      >
        {attachment.type === 'image' && (
          <div className="relative h-32 bg-muted flex items-center justify-center">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between gap-2 p-2 bg-background">
          <div className="flex items-center gap-2 min-w-0">
            <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-medium truncate">{attachment.name}</span>
            {statusIcon()}
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{attachment.size}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <ScrollArea className="h-full pr-1">
      <div className="p-4 space-y-6">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="space-y-4">
            <div className="relative flex items-center py-2">
              <div className="grow border-t border-border"></div>
              <span className="mx-2 flex-shrink-0 text-xs font-medium text-muted-foreground">
                {formatDateHeader(date)}
              </span>
              <div className="grow border-t border-border"></div>
            </div>
            
            {groupedMessages[date].map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender.id === currentUserId ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[75%] space-y-1.5",
                    message.sender.id === currentUserId ? "items-end" : "items-start"
                  )}
                >
                  {message.sender.id !== currentUserId && (
                    <p className="text-xs font-medium">
                      {message.sender.name} ({message.sender.role})
                    </p>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      message.sender.id === currentUserId
                        ? "bg-primary/10 text-primary ml-auto"
                        : "bg-accent"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="space-y-2">
                        {message.attachments.map(renderAttachment)}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {formatMessageDate(message.timestamp)}
                    {!message.isRead && message.sender.id === currentUserId && (
                      <span className="ml-1.5 text-primary">• Delivered</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
