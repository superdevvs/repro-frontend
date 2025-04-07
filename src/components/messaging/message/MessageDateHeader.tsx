
import React from 'react';
import { format } from 'date-fns';

interface MessageDateHeaderProps {
  date: string;
}

export function MessageDateHeader({ date }: MessageDateHeaderProps) {
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

  return (
    <div className="sticky top-0 z-10 text-center py-2 bg-white/80 backdrop-blur-sm border-b">
      <span className="text-xs font-medium text-muted-foreground">
        {formatDateHeader(date)}
      </span>
    </div>
  );
}
