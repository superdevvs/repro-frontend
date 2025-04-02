
import React, { useState, useRef } from 'react';
import { Send, Paperclip, SmilePlus, Template } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MessageTemplate } from '@/types/messages';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  templates?: MessageTemplate[];
}

export function MessageInput({ onSendMessage, isLoading = false, templates = [] }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    
    onSendMessage(content, attachments);
    setContent('');
    setAttachments([]);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };
  
  const handleInsertTemplate = (template: MessageTemplate) => {
    setContent(template.content);
  };
  
  return (
    <div className="p-3 border-t border-border">
      {attachments.length > 0 && (
        <div className="mb-3 flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {attachments.length} file{attachments.length > 1 ? 's' : ''} selected
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-6 ml-auto text-xs"
            onClick={() => setAttachments([])}
          >
            Clear
          </Button>
        </div>
      )}
      
      <div className="relative">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[80px] pr-20 resize-none"
        />
        
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {templates.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Template className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-60 p-0">
                <div className="p-2 font-medium text-sm border-b">
                  Message Templates
                </div>
                <div className="max-h-60 overflow-auto divide-y">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant="ghost"
                      className="w-full justify-start p-2 h-auto text-left font-normal text-sm"
                      onClick={() => handleInsertTemplate(template)}
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            disabled={isLoading || (!content.trim() && attachments.length === 0)}
            className="h-8 w-8"
            onClick={handleSend}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
