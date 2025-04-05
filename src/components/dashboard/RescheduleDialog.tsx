
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelect } from "@/components/ui/time-select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShootData } from '@/types/shoots';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useShoots } from '@/context/ShootsContext';

interface RescheduleDialogProps {
  shoot: ShootData;
  isOpen: boolean;
  onClose: () => void;
}

export function RescheduleDialog({ shoot, isOpen, onClose }: RescheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>(
    shoot.scheduledDate ? new Date(shoot.scheduledDate) : undefined
  );
  const [time, setTime] = useState<string>(
    shoot.time || "10:00 AM"
  );
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, role } = useAuth();
  const { toast } = useToast();
  const { updateShoot } = useShoots();
  
  const handleReschedule = async () => {
    if (!date) {
      toast({
        title: "Select a date",
        description: "Please select a new date for the shoot.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const originalDate = new Date(shoot.scheduledDate);
      
      // Convert shoot ID to string to match the database schema
      const shootIdString = typeof shoot.id === 'number' ? String(shoot.id) : shoot.id;
      const requestedById = typeof user?.id === 'number' ? String(user.id) : (user?.id || role + '-' + Date.now());
      
      // Store the reschedule request in the database
      const { error } = await supabase.from('shoot_reschedule_requests').insert({
        shoot_id: shootIdString,
        requested_by: requestedById,
        original_date: originalDate.toISOString(),
        requested_date: date.toISOString(),
        reason: reason,
      });
      
      if (error) throw error;
      
      // Update the shoot in the local state
      updateShoot(shoot.id, {
        scheduledDate: format(date, 'yyyy-MM-dd'),
        time: time,
        status: 'pending' as const,
      });
      
      // Show success message
      toast({
        title: "Rescheduling requested",
        description: "The shoot has been rescheduled successfully.",
      });
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error('Error rescheduling shoot:', error);
      toast({
        title: "Failed to reschedule",
        description: "There was an error rescheduling the shoot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getAvailableTimes = () => {
    return [
      "9:00 AM", 
      "10:00 AM", 
      "11:00 AM", 
      "1:00 PM", 
      "2:00 PM", 
      "3:00 PM"
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Shoot</DialogTitle>
          <DialogDescription>
            Select a new date and time for this shoot.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md p-3"
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Select Time</Label>
            <TimeSelect
              value={time}
              onChange={setTime}
              availableTimes={getAvailableTimes()}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Reason for Rescheduling (Optional)</Label>
            <Textarea
              placeholder="Enter the reason for rescheduling..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleReschedule} disabled={isSubmitting}>
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
