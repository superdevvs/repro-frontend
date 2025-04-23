
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
    <div className="rounded-xl border border-[#E5DEFF] dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow">
      {attachment.type === 'image' && (
        <div className="relative h-32 md:h-40 bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <Paperclip className="h-3.5 w-3.5 text-[#6E59A5] dark:text-[#9b87f5] flex-shrink-0" />
          <span className="text-xs font-medium truncate">{attachment.name}</span>
          <StatusIcon />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{attachment.size}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 rounded-lg hover:bg-[#F1F0FB] dark:hover:bg-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-[#6E59A5] dark:text-[#9b87f5]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
