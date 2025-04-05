import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { ShootData } from '@/types/shoots';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toStringId } from "@/utils/formatters";

interface MessageFormProps {
  shoot: ShootData;
  onSent: () => void;
}

type FormValues = {
  message: string;
};

export function MessageForm({ shoot, onSent }: MessageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, role } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!values.message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Determine recipient (photographer if sender is client or admin, client if sender is photographer)
      const recipientId = role === 'photographer' 
        ? shoot.client.id ? toStringId(shoot.client.id) : 'client-' + toStringId(shoot.id)
        : shoot.photographer?.id ? toStringId(shoot.photographer.id) : 'photographer-' + toStringId(shoot.id);
      
      const senderId = user?.id || role + '-' + Date.now();
      
      // Convert ID to string to match the database schema
      const shootIdString = toStringId(shoot.id);
      
      const { error } = await supabase.from('messages').insert({
        shoot_id: shootIdString,
        sender_id: toStringId(senderId),
        recipient_id: toStringId(recipientId),
        message: values.message,
      });
      
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Message sent successfully",
        description: "Your message has been delivered.",
      });
      
      // Reset form
      form.reset();
      
      // Call the onSent callback
      onSent();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Type your message here..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </form>
    </Form>
  );
}
