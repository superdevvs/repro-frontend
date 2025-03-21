
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShootData } from '@/types/shoots';
import { MessageForm } from './MessageForm';

interface MessageDialogProps {
  shoot: ShootData;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageDialog({ shoot, isOpen, onClose }: MessageDialogProps) {
  const handleMessageSent = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message</DialogTitle>
          <DialogDescription>
            Send a message regarding shoot #{shoot.id}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <MessageForm shoot={shoot} onSent={handleMessageSent} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
