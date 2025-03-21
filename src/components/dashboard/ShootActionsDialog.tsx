
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShootData } from '@/types/shoots';
import { RescheduleDialog } from './RescheduleDialog';
import { useShoots } from '@/context/ShootsContext';
import { useToast } from '@/hooks/use-toast';

interface ShootActionsDialogProps {
  shoot: ShootData;
  isOpen: boolean;
  onClose: () => void;
}

export function ShootActionsDialog({ shoot, isOpen, onClose }: ShootActionsDialogProps) {
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const { updateShoot } = useShoots();
  const { toast } = useToast();

  const handleCancel = () => {
    updateShoot(shoot.id, { status: 'hold' });
    toast({
      title: "Shoot cancelled",
      description: `Shoot #${shoot.id} has been marked as on hold.`,
    });
    onClose();
  };

  const handleAccept = () => {
    updateShoot(shoot.id, { status: 'scheduled' });
    toast({
      title: "Shoot confirmed",
      description: `Shoot #${shoot.id} has been confirmed and scheduled.`,
    });
    onClose();
  };

  const handleReschedule = () => {
    setShowRescheduleDialog(true);
  };

  const handleRescheduleClose = () => {
    setShowRescheduleDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen && !showRescheduleDialog} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md outline-none focus:outline-none focus:ring-0">
          <DialogHeader>
            <DialogTitle>Shoot Actions</DialogTitle>
            <DialogDescription>
              Choose an action for shoot #{shoot.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p className="text-sm">
              Property: {shoot.location.fullAddress}
            </p>
            <p className="text-sm">
              Client: {shoot.client.name}
            </p>
            <p className="text-sm">
              Date: {new Date(shoot.scheduledDate).toLocaleDateString()}
              {shoot.time ? ` at ${shoot.time}` : ''}
            </p>
          </div>
          
          <DialogFooter className="flex flex-wrap justify-end gap-2">
            {/* Show only the three required options */}
            <Button variant="outline" onClick={handleCancel}>
              Cancel Shoot
            </Button>
            
            <Button variant="outline" onClick={handleReschedule}>
              Reschedule
            </Button>
            
            <Button onClick={handleAccept}>
              Confirm & Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {showRescheduleDialog && (
        <RescheduleDialog 
          shoot={shoot} 
          isOpen={showRescheduleDialog} 
          onClose={handleRescheduleClose} 
        />
      )}
    </>
  );
}
