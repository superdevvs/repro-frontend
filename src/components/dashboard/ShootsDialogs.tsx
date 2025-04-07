
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShootDetail } from '@/components/dashboard/ShootDetail';
import { FileUploader } from '@/components/media/FileUploader';
import { ShootData } from '@/types/shoots';

interface ShootsDialogsProps {
  selectedShoot: ShootData | null;
  isDetailOpen: boolean;
  isUploadDialogOpen: boolean;
  setIsDetailOpen: (isOpen: boolean) => void;
  setIsUploadDialogOpen: (isOpen: boolean) => void;
  onUploadComplete: (files: File[]) => void;
}

export function ShootsDialogs({ 
  selectedShoot,
  isDetailOpen,
  isUploadDialogOpen,
  setIsDetailOpen,
  setIsUploadDialogOpen,
  onUploadComplete
}: ShootsDialogsProps) {
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
          </DialogHeader>
          <FileUploader 
            shootId={selectedShoot?.id} 
            onUploadComplete={onUploadComplete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
