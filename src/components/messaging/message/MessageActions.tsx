
import React from 'react';
import { Reply, Star, Trash2, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Message } from '@/types/messages';

interface MessageActionsProps {
  message: Message;
  onMarkAsTask?: (message: Message) => void;
}

export function MessageActions({ message, onMarkAsTask }: MessageActionsProps) {
  return (
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
  );
}
