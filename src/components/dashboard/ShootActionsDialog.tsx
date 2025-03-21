
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

  const handleCompleted = () => {
    updateShoot(shoot.id, { status: 'completed' });
    toast({
      title: "Shoot completed",
      description: `Shoot #${shoot.id} has been marked as completed.`,
    });
    onClose();
  };

  const handlePending = () => {
    updateShoot(shoot.id, { status: 'pending' });
    toast({
      title: "Shoot pending",
      description: `Shoot #${shoot.id} has been marked as pending.`,
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
        <DialogContent className="sm:max-w-md">
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
            {/* Always show Cancel button except for completed shoots */}
            {shoot.status !== 'completed' && (
              <Button variant="outline" onClick={handleCancel}>
                Cancel Shoot
              </Button>
            )}
            
            {/* Show different actions based on status */}
            {shoot.status === 'hold' && (
              <Button variant="outline" onClick={handleAccept}>
                Confirm & Schedule
              </Button>
            )}
            
            {shoot.status === 'scheduled' && (
              <Button variant="outline" onClick={handlePending}>
                Mark as Pending
              </Button>
            )}
            
            {shoot.status === 'pending' && (
              <Button variant="outline" onClick={handleCompleted}>
                Mark as Completed
              </Button>
            )}
            
            {/* Show Reschedule option for everything except completed shoots */}
            {shoot.status !== 'completed' && (
              <Button variant="outline" onClick={handleReschedule}>
                Reschedule
              </Button>
            )}
            
            {/* Primary action button */}
            <Button onClick={handleAccept}>
              {shoot.status === 'hold' ? 'Confirm & Schedule' : 'Accept & Confirm'}
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
