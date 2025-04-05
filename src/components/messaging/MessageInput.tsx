
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, SmilePlus, FileText, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { MessageTemplate } from '@/types/messages';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  templates?: MessageTemplate[];
}

export function MessageInput({ onSendMessage, isLoading = false, templates = [] }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  
  // Handle textarea auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 150); // Max height of 150px
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
    
    // Show toast on send
    toast.success('Message sent');
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
      // Validate file types and sizes
      const validFiles = newFiles.filter(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast.error(`File ${file.name} exceeds 10MB limit`);
          return false;
        }
        return true;
      });
      
      setAttachments(validFiles);
    }
  };
  
  const handleInsertTemplate = (template: MessageTemplate) => {
    setContent(template.content);
  };
  
  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      setAudioChunks([]);
      setIsRecording(true);
      setMediaRecorder(recorder);
      
      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      });
      
      recorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Convert to base64 for processing
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (base64Audio) {
            // In real app, send to Supabase Edge Function for processing
            try {
              toast.loading('Transcribing your message...');
              
              // Mock response for demo
              // In production, would call Supabase Edge Function:
              // const { data, error } = await supabase.functions.invoke('transcribe-audio', {
              //   body: { audio: base64Audio }
              // });
              
              // Simulate API call delay
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              // Mock response
              const mockTranscription = "This is a transcribed message from voice input.";
              setContent(prev => prev + (prev ? ' ' : '') + mockTranscription);
              toast.dismiss();
              toast.success('Voice message transcribed');
            } catch (error) {
              console.error('Transcription error:', error);
              toast.dismiss();
              toast.error('Failed to transcribe audio');
            }
          }
        };
        
        // Clean up recording state
        setIsRecording(false);
        setMediaRecorder(null);
      });
      
      recorder.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      
      // Stop all tracks of the stream
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  return (
    <div className="p-2 md:p-3 border-t border-border">
      {attachments.length > 0 && (
        <div className="mb-2 md:mb-3 flex items-center gap-2 px-2">
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
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[40px] max-h-[150px] pr-20 resize-none overflow-auto"
        />
        
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${isRecording ? 'text-red-500' : ''}`}
              onClick={handleVoiceInput}
              aria-label={isRecording ? 'Stop recording' : 'Voice input'}
            >
              <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
            </Button>
          )}
          
          {templates.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
