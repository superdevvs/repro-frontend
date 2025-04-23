import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, SmilePlus, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }
  }, [content]);

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    
    onSendMessage(content, attachments);
    setContent('');
    setAttachments([]);
    
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
        if (file.size > 10 * 1024 * 1024) {
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
    <div className="border-t p-4 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/90">
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 rounded-xl px-3 py-1.5 border border-[#E5DEFF] dark:border-slate-700 shadow-sm">
              <Paperclip className="h-3.5 w-3.5 text-[#6E59A5] dark:text-[#9b87f5]" />
              <span className="text-xs truncate max-w-[120px]">{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                onClick={() => handleRemoveAttachment(index)}
              >
                &times;
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-start gap-3">
        <div className="relative flex-1 overflow-hidden rounded-2xl border border-[#E5DEFF] dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[40px] max-h-[120px] resize-none px-4 py-3 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          
          <div className="flex items-center px-3 py-2 bg-slate-50/80 dark:bg-slate-800/50 border-t border-[#E5DEFF]/60 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-xl hover:bg-white dark:hover:bg-slate-700"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Paperclip className="h-4 w-4 text-[#6E59A5] dark:text-[#9b87f5]" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-xl hover:bg-white dark:hover:bg-slate-700"
              >
                <Image className="h-4 w-4 text-[#6E59A5] dark:text-[#9b87f5]" />
              </Button>
              
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-xl hover:bg-white dark:hover:bg-slate-700"
                >
                  <SmilePlus className="h-4 w-4 text-[#6E59A5] dark:text-[#9b87f5]" />
                </Button>
              )}
            </div>
            
            {templates.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 ml-1 rounded-xl hover:bg-white dark:hover:bg-slate-700"
                  >
                    <FileText className="h-4 w-4 text-[#6E59A5] dark:text-[#9b87f5]" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-0">
                  <div className="p-2 font-medium text-sm border-b dark:border-slate-700">
                    Message Templates
                  </div>
                  <div className="max-h-60 overflow-auto divide-y dark:divide-slate-700">
                    {templates.map((template) => (
                      <Button
                        key={template.id}
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto text-left font-normal text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
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
          className="h-12 w-12 rounded-2xl bg-[#6E59A5] hover:bg-[#9b87f5] dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB] shadow-lg hover:shadow-xl transition-all"
          disabled={isLoading || (!content.trim() && attachments.length === 0)}
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
