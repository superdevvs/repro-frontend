
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarClock, Check, X } from "lucide-react";
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';
import { useToast } from "@/hooks/use-toast";
import { RescheduleDialog } from './RescheduleDialog';

interface ShootActionsDialogProps {
  shoot: ShootData;
  isOpen: boolean;
  onClose: () => void;
}

export function ShootActionsDialog({ shoot, isOpen, onClose }: ShootActionsDialogProps) {
  const [showReschedule, setShowReschedule] = useState(false);
  const { updateShoot } = useShoots();
  const { toast } = useToast();
  
  const handleAccept = () => {
    updateShoot(shoot.id, {
      status: 'scheduled' as const,
    });
    
    toast({
      title: "Shoot accepted",
      description: "The shoot has been accepted and scheduled.",
    });
    
    onClose();
  };
  
  const handleCancel = () => {
    updateShoot(shoot.id, {
      status: 'hold' as const, // Using 'hold' as it's in the allowed status types
    });
    
    toast({
      title: "Shoot on hold",
      description: "The shoot has been put on hold.",
    });
    
    onClose();
  };
  
  const handleReschedule = () => {
    setShowReschedule(true);
  };
  
  const closeRescheduleDialog = () => {
    setShowReschedule(false);
  };

  return (
    <>
      <Dialog open={isOpen && !showReschedule} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shoot Actions</DialogTitle>
            <DialogDescription>
              Choose an action for shoot #{shoot.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Button 
              onClick={handleAccept} 
              className="flex items-center justify-start"
              variant="subtle"
            >
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Accept Shoot
            </Button>
            
            <Button 
              onClick={handleReschedule} 
              className="flex items-center justify-start"
              variant="subtle"
            >
              <CalendarClock className="mr-2 h-4 w-4 text-blue-500" />
              Reschedule Shoot
            </Button>
            
            <Button 
              onClick={handleCancel} 
              className="flex items-center justify-start"
              variant="subtle"
            >
              <X className="mr-2 h-4 w-4 text-red-500" />
              Put On Hold
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {showReschedule && (
        <RescheduleDialog
          shoot={shoot}
          isOpen={showReschedule}
          onClose={closeRescheduleDialog}
        />
      )}
    </>
  );
}
