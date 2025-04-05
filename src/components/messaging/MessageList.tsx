
import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Paperclip, Download, CheckCircle, AlertCircle, CheckSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message, Attachment } from '@/types/messages';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onMarkAsTask?: (message: Message) => void;
}

export function MessageList({ messages, currentUserId, onMarkAsTask }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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
          <div className="relative h-24 md:h-32 bg-muted flex items-center justify-center">
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
      <div className="p-2 md:p-4 space-y-4 md:space-y-6">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date} className="space-y-3 md:space-y-4">
            <div className="relative flex items-center py-1 md:py-2">
              <div className="grow border-t border-border"></div>
              <span className="mx-2 flex-shrink-0 text-xs font-medium text-muted-foreground">
                {formatDateHeader(date)}
              </span>
              <div className="grow border-t border-border"></div>
            </div>
            
            {groupedMessages[date].map((message) => {
              const isSender = message.sender.id === currentUserId;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isSender ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] md:max-w-[75%] space-y-1",
                      isSender ? "items-end" : "items-start"
                    )}
                  >
                    {!isSender && (
                      <p className="text-xs font-medium">
                        {message.sender.name} 
                        <span className="text-muted-foreground">({message.sender.role})</span>
                      </p>
                    )}
                    
                    <div
                      className={cn(
                        "rounded-2xl p-3",
                        isSender
                          ? "bg-primary text-primary-foreground rounded-tr-sm ml-auto"
                          : "bg-secondary rounded-tl-sm"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="space-y-1 md:space-y-2 mt-1">
                          {message.attachments.map(renderAttachment)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {formatMessageDate(message.timestamp)}
                        {!message.isRead && isSender && (
                          <span className="ml-1.5 text-primary">• Delivered</span>
                        )}
                      </p>
                      
                      {!isMobile && onMarkAsTask && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => onMarkAsTask(message)}
                            >
                              <CheckSquare className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top">Mark as task</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
