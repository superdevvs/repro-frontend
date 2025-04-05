
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShootData } from '@/types/shoots';
import { MessageForm } from '../dashboard/MessageForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';

interface MessageDialogProps {
  shoot: ShootData;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageDialog({ shoot, isOpen, onClose }: MessageDialogProps) {
  const isMobile = useIsMobile();
  const handleMessageSent = () => {
    onClose();
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Send Message</DrawerTitle>
            <DrawerDescription>
              Send a message regarding shoot #{shoot.id}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 py-2 pb-6">
            <MessageForm shoot={shoot} onSent={handleMessageSent} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

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
