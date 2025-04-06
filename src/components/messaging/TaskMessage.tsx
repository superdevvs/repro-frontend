
import React from 'react';
import { Message } from '@/types/messages';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TaskMessageProps {
  message: Message;
  isCompleted: boolean;
  onToggleComplete: (messageId: string, isCompleted: boolean) => void;
}

export function TaskMessage({ message, isCompleted, onToggleComplete }: TaskMessageProps) {
  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "mb-3 shadow-sm transition-all transform hover:-translate-y-0.5 duration-200",
        isCompleted ? "bg-muted/40" : "bg-card border-border/70"
      )}>
        <CardContent className="p-4 flex items-start gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 rounded-md mt-0.5"
            onClick={() => onToggleComplete(message.id, !isCompleted)}
          >
            {isCompleted ? (
              <CheckSquare className="h-4.5 w-4.5 text-green-500" />
            ) : (
              <Square className="h-4.5 w-4.5" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-base font-medium mb-1.5 leading-snug",
              isCompleted && "line-through text-muted-foreground"
            )}>
              {message.content}
            </p>
            
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>From: {message.sender.name}</span>
                <span className="h-1 w-1 bg-muted-foreground/40 rounded-full"></span>
                <span>{formatMessageDate(message.timestamp)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
