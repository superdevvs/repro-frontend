
import React from 'react';
import { Message } from '@/types/messages';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskMessageProps {
  message: Message;
  isCompleted: boolean;
  onToggleComplete: (messageId: string, isCompleted: boolean) => void;
}

export function TaskMessage({ message, isCompleted, onToggleComplete }: TaskMessageProps) {
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, h:mm a');
  };
  
  return (
    <Card className={cn(
      "mb-2 transition-all",
      isCompleted ? "bg-muted/40" : "bg-card"
    )}>
      <CardContent className="p-3 flex items-start gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0 rounded-md mt-0.5"
          onClick={() => onToggleComplete(message.id, !isCompleted)}
        >
          {isCompleted ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium mb-1",
            isCompleted && "line-through text-muted-foreground"
          )}>
            {message.content}
          </p>
          
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>From: {message.sender.name}</span>
              <span>•</span>
              <span>{formatMessageDate(message.timestamp)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
