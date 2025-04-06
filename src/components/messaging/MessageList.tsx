
import React, { useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Paperclip, Download, CheckCircle, AlertCircle, CheckSquare, CornerDownLeft, Reply, Star, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Message, Attachment } from '@/types/messages';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onMarkAsTask?: (message: Message) => void;
  selectedMessageId?: string;
}

export function MessageList({ messages, currentUserId, onMarkAsTask, selectedMessageId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && (!selectedMessageId || selectedMessageId === messages[messages.length - 1]?.id)) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedMessageId]);
  
  // Format date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };
  
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
      return format(date, 'd MMM yyyy');
    }
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
        className="mt-2 rounded-md border overflow-hidden flex flex-col bg-white"
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
        
        <div className="flex items-center justify-between gap-2 p-2">
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

  // For individual message styling
  const messageWrapperClasses = (isSelected?: boolean) => cn(
    "p-4 relative transition-all duration-200 hover:bg-slate-50",
    isSelected && "bg-slate-50 border-l-4 border-primary"
  );
  
  return (
    <ScrollArea className="h-full">
      {Object.entries(groupedMessages).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
          <p>No messages in this conversation</p>
        </div>
      ) : (
        <div>
          {Object.keys(groupedMessages).map((date, index) => (
            <div key={date} className="border-b last:border-b-0">
              <div className="sticky top-0 z-10 text-center py-2 bg-white/80 backdrop-blur-sm border-b">
                <span className="text-xs font-medium text-muted-foreground">
                  {formatDateHeader(date)}
                </span>
              </div>
              
              {groupedMessages[date].map((message) => {
                const isSelected = selectedMessageId === message.id;
                
                return (
                  <div 
                    key={message.id} 
                    className={messageWrapperClasses(isSelected)}
                    id={`message-${message.id}`}
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                        <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{message.sender.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.sender.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatMessageDate(message.timestamp)}
                            </span>
                            <div className="flex items-center">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100">
                                    <Star className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Star</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100">
                                    <Reply className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reply</TooltipContent>
                              </Tooltip>
                              
                              {onMarkAsTask && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                                      onClick={() => onMarkAsTask(message)}
                                    >
                                      <CheckSquare className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Mark as task</TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {message.attachments.map(renderAttachment)}
                          </div>
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
      )}
    </ScrollArea>
  );
}
