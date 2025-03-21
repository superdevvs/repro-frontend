
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, ImageIcon } from "lucide-react";
import { ShootData } from '@/types/shoots';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileUploader } from '@/components/media/FileUploader';
import { useToast } from '@/hooks/use-toast';

interface ShootMediaTabProps {
  shoot: ShootData;
  isPhotographer: boolean;
}

export function ShootMediaTab({ shoot, isPhotographer }: ShootMediaTabProps) {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const handleUploadComplete = (files: File[]) => {
    setUploadDialogOpen(false);
    
    toast({
      title: 'Upload Complete',
      description: `Successfully uploaded ${files.length} files for shoot #${shoot.id}`,
    });
  };
  
  return (
    <>
      {shoot.media?.photos && shoot.media.photos.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {shoot.media.photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                <img 
                  src={photo} 
                  alt={`Property photo ${index + 1}`} 
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-2">
            {isPhotographer && (
              <Button variant="outline" onClick={() => setUploadDialogOpen(true)}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload More
              </Button>
            )}
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Media Available</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {shoot.status === 'completed' 
              ? 'No media has been uploaded for this shoot yet.' 
              : 'Media will be available after the shoot is completed.'}
          </p>
          {isPhotographer && shoot.status === 'completed' && (
            <Button onClick={() => setUploadDialogOpen(true)}>
              <ImageIcon className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          )}
        </div>
      )}
      
      {/* Upload Media Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Upload Media for Shoot #{shoot.id}</DialogTitle>
            <DialogDescription>
              Upload photos, videos, or documents related to this property shoot.
            </DialogDescription>
          </DialogHeader>
          <FileUploader 
            shootId={shoot.id.toString()}
            onUploadComplete={handleUploadComplete}
            className="mt-4"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
