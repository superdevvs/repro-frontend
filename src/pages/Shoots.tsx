
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { ShootsHeader } from '@/components/dashboard/ShootsHeader';
import { ShootsFilter } from '@/components/dashboard/ShootsFilter';
import { ShootsContent } from '@/components/dashboard/ShootsContent';
import { ShootsPagination } from '@/components/dashboard/ShootsPagination';
import { ShootsDialogs } from '@/components/dashboard/ShootsDialogs';
import { QuickBookingCard } from '@/components/dashboard/QuickBookingCard';
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 6;

const Shoots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { shoots, updateShoot } = useShoots();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter shoots based on user role
  const userFilteredShoots = shoots.filter(shoot => {
    if (user && user.role === 'client') {
      return shoot.client.name === user.name;
    }
    return true;
  });
  
  // Filter shoots based on search and tab
  const filteredShoots = userFilteredShoots.filter(shoot => {
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
  
  const totalPages = Math.ceil(filteredShoots.length / ITEMS_PER_PAGE);
  const paginatedShoots = filteredShoots.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const isCompletedTab = selectedTab === 'completed';
  
  const handleShootSelect = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsDetailOpen(true);
  };
  
  const handleUploadMedia = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsUploadDialogOpen(true);
  };
  
  const handleUploadComplete = (files: File[]) => {
    if (!selectedShoot) return;
    
    const photoUrls = files
      .filter(file => file.type.startsWith('image/'))
      .map(() => '/placeholder.svg');
    
    updateShoot(selectedShoot.id, {
      media: {
        ...selectedShoot.media,
        photos: [...(selectedShoot.media?.photos || []), ...photoUrls]
      }
    });
    
    setIsUploadDialogOpen(false);
    toast({
      title: "Upload Complete",
      description: `${files.length} files have been uploaded successfully.`
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleNewShoot = () => {
    navigate('/book-shoot');
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchTerm, user]);
  
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
          
          {/* Quick Booking Card - Show only for admin users */}
          {['admin', 'superadmin'].includes(user?.role || '') && (
            <QuickBookingCard />
          )}
          
          <ShootsFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          <ShootsContent 
            filteredShoots={paginatedShoots}
            viewMode={viewMode}
            onShootSelect={handleShootSelect}
            onUploadMedia={isCompletedTab ? handleUploadMedia : undefined}
            showMedia={isCompletedTab}
          />

          <ShootsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        
        <ShootsDialogs 
          selectedShoot={selectedShoot}
          isDetailOpen={isDetailOpen}
          isUploadDialogOpen={isUploadDialogOpen}
          setIsDetailOpen={setIsDetailOpen}
          setIsUploadDialogOpen={setIsUploadDialogOpen}
          onUploadComplete={handleUploadComplete}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default Shoots;
