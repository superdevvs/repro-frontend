
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Message } from '@/types/messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageAttachment } from './MessageAttachment';
import { MessageActions } from './MessageActions';

interface MessageItemProps {
  message: Message;
  isSelected: boolean;
  onMarkAsTask?: (message: Message) => void;
}

export function MessageItem({ message, isSelected, onMarkAsTask }: MessageItemProps) {
  // Format date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const messageWrapperClasses = cn(
    "p-4 relative transition-all duration-200 hover:bg-slate-50",
    isSelected && "bg-slate-50 border-l-4 border-primary"
  );

  return (
    <div 
      className={messageWrapperClasses}
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
              <MessageActions message={message} onMarkAsTask={onMarkAsTask} />
            </div>
          </div>
          
          <div className="text-sm">
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="space-y-2 mt-3">
              {message.attachments.map(attachment => (
                <MessageAttachment key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
