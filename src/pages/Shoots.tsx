
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { ShootDetail } from '@/components/dashboard/ShootDetail';
import { ShootsHeader } from '@/components/dashboard/ShootsHeader';
import { ShootsFilter } from '@/components/dashboard/ShootsFilter';
import { ShootsContent } from '@/components/dashboard/ShootsContent';
import { ImportShootsDialog } from '@/components/dashboard/ImportShootsDialog';
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileUploader } from '@/components/media/FileUploader';

const Shoots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('hold');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  
  const { shoots, updateShoot } = useShoots();
  
  const filteredShoots = shoots.filter(shoot => {
    const matchesSearch = 
      shoot.location.fullAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoot.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shoot.photographer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'scheduled') return matchesSearch && shoot.status === 'scheduled';
    if (selectedTab === 'completed') return matchesSearch && shoot.status === 'completed';
    if (selectedTab === 'pending') return matchesSearch && shoot.status === 'pending';
    if (selectedTab === 'hold') return matchesSearch && shoot.status === 'hold';
    return false;
  });
  
  const isCompletedTab = selectedTab === 'completed';
  
  const handleShootSelect = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsDetailOpen(true);
  };
  
  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedShoot(null);
  };
  
  const handleUploadMedia = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsUploadDialogOpen(true);
  };
  
  const handleUploadComplete = (files: File[]) => {
    if (!selectedShoot) return;
    
    // Create URLs for the uploaded files (in a real app, these would be hosted URLs)
    const photoUrls = files
      .filter(file => file.type.startsWith('image/'))
      .map(() => '/placeholder.svg');
    
    // Update the shoot with new media
    updateShoot(selectedShoot.id, {
      media: {
        ...selectedShoot.media,
        photos: [...(selectedShoot.media?.photos || []), ...photoUrls]
      }
    });
    
    // Close the dialog after upload is complete
    setIsUploadDialogOpen(false);
  };
  
  const handleImportClick = () => {
    setIsImportDialogOpen(true);
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <ShootsHeader 
            title={isCompletedTab ? "Completed Shoots" : "Property Shoots"} 
            subtitle={isCompletedTab 
              ? "View and manage completed property photoshoots."
              : "Manage and track all property photoshoot sessions."
            } 
          />
          
          <ShootsFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onImportClick={handleImportClick}
          />
          
          <ShootsContent 
            filteredShoots={filteredShoots}
            viewMode={viewMode}
            onShootSelect={handleShootSelect}
            onUploadMedia={isCompletedTab ? handleUploadMedia : undefined}
            showMedia={isCompletedTab}
          />
        </div>
        
        <ShootDetail 
          shoot={selectedShoot}
          isOpen={isDetailOpen}
          onClose={closeDetail}
        />
        
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Upload Media for {selectedShoot?.location.fullAddress}</DialogTitle>
            </DialogHeader>
            <FileUploader 
              shootId={selectedShoot?.id} 
              onUploadComplete={handleUploadComplete}
            />
          </DialogContent>
        </Dialog>
        
        <ImportShootsDialog 
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default Shoots;
