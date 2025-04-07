
import React from 'react';
import { Paperclip, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Attachment } from '@/types/messages';

interface MessageAttachmentProps {
  attachment: Attachment;
}

export function MessageAttachment({ attachment }: MessageAttachmentProps) {
  const StatusIcon = () => {
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
          <StatusIcon />
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
}
