
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ShootDetail } from '@/components/dashboard/ShootDetail';
import { FileUploader } from '@/components/media/FileUploader';
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';

interface ShootsDialogsProps {
  selectedShoot: ShootData | null;
  isDetailOpen: boolean;
  isUploadDialogOpen: boolean;
  setIsDetailOpen: (isOpen: boolean) => void;
  setIsUploadDialogOpen: (isOpen: boolean) => void;
  onUploadComplete: (files: File[], notes?: string) => void;
}

export function ShootsDialogs({ 
  selectedShoot,
  isDetailOpen,
  isUploadDialogOpen,
  setIsDetailOpen,
  setIsUploadDialogOpen,
  onUploadComplete
}: ShootsDialogsProps) {
  const { shoots } = useShoots();
  const [initialNotes, setInitialNotes] = useState('');

  // When the selected shoot changes, get the appropriate notes based on role
  useEffect(() => {
    if (selectedShoot && selectedShoot.notes) {
      // Get notes from the shoot if available
      if (typeof selectedShoot.notes === 'object') {
        if (selectedShoot.notes.photographerNotes) {
          setInitialNotes(String(selectedShoot.notes.photographerNotes));
        } else if (selectedShoot.notes.editingNotes) {
          setInitialNotes(String(selectedShoot.notes.editingNotes));
        } else if (selectedShoot.notes.shootNotes) {
          setInitialNotes(String(selectedShoot.notes.shootNotes));
        } else {
          setInitialNotes('');
        }
      } else if (typeof selectedShoot.notes === 'string') {
        setInitialNotes(selectedShoot.notes);
      }
    } else {
      setInitialNotes('');
    }
  }, [selectedShoot]);

  return (
    <>
      <ShootDetail 
        shoot={selectedShoot}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
      
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload Media for {selectedShoot?.location.fullAddress}</DialogTitle>
            <DialogDescription>
              Add photos, videos, or other media files related to this property.
            </DialogDescription>
          </DialogHeader>
          <FileUploader 
            shootId={selectedShoot?.id} 
            onUploadComplete={onUploadComplete}
            initialNotes={initialNotes}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
