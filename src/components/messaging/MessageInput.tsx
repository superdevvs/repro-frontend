
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, SmilePlus, Image, FileText, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MessageTemplate } from '@/types/messages';
import { useIsMobile } from '@/hooks/use-mobile';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  templates?: MessageTemplate[];
}

export function MessageInput({ onSendMessage, isLoading = false, templates = [] }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  
  // Handle textarea auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height
      textarea.style.height = `${newHeight}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    
    onSendMessage(content, attachments);
    setContent('');
    setAttachments([]);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast.error(`File ${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });
      
      setAttachments(prevAttachments => [...prevAttachments, ...validFiles]);
    }
  };
  
  const handleInsertTemplate = (template: MessageTemplate) => {
    setContent(template.content);
  };
  
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  return (
    <div className="border-t p-4 bg-white dark:bg-slate-800">
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-md px-2 py-1">
              <Paperclip className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span className="text-xs truncate max-w-[120px]">{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 rounded-full"
                onClick={() => handleRemoveAttachment(index)}
              >
                &times;
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-start gap-2">
        <div className="relative flex-1 border rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-primary focus-within:border-primary dark:border-slate-700">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing to reply..."
            className="min-h-[40px] max-h-[120px] resize-none px-3 py-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-slate-800"
          />
          
          <div className="flex items-center px-2 py-1.5 bg-slate-50 dark:bg-slate-700 border-t dark:border-slate-600">
            <div className="flex items-center gap-1.5">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
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
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <Image className="h-4 w-4" />
              </Button>
              
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  <SmilePlus className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {templates.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-7 w-7 ml-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
                  >
                    <FileText className="h-4 w-4" />
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
          </div>
        </div>
        
        <Button
          size="icon"
          className="h-10 w-10 rounded-full"
          disabled={isLoading || (!content.trim() && attachments.length === 0)}
          onClick={handleSend}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
