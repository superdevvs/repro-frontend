
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
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  const messageWrapperClasses = cn(
    "group p-4 relative transition-all duration-200",
    "hover:bg-[#F1F0FB] dark:hover:bg-slate-800/60",
    isSelected && "bg-[#F1F0FB] dark:bg-slate-800/60 border-l-4 border-[#6E59A5] dark:border-[#9b87f5]"
  );

  return (
    <div 
      className={messageWrapperClasses}
      id={`message-${message.id}`}
    >
      <div className="flex gap-4">
        <Avatar className="h-10 w-10 rounded-xl border-2 border-[#E5DEFF] dark:border-slate-700">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback className="bg-[#F1F0FB] dark:bg-slate-800 text-[#6E59A5] dark:text-[#9b87f5]">
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">{message.sender.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F1F0FB] dark:bg-slate-800 text-[#6E59A5] dark:text-[#9b87f5]">
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
          
          <div className="text-sm leading-relaxed">
            <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{message.content}</p>
          </div>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="space-y-2 mt-4">
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
