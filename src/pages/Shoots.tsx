
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { ShootDetail } from '@/components/dashboard/ShootDetail';
import { ShootsHeader } from '@/components/dashboard/ShootsHeader';
import { ShootsFilter } from '@/components/dashboard/ShootsFilter';
import { ShootsContent } from '@/components/dashboard/ShootsContent';
import { ShootData } from '@/types/shoots';
import { useShoots } from '@/context/ShootsContext';

const Shoots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // Set the default tab to 'hold' instead of 'scheduled'
  const [selectedTab, setSelectedTab] = useState('hold');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Use the shoots from context instead of importing directly from data file
  const { shoots } = useShoots();
  
  // Filter shoots based on search term and selected tab
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
  
  // Special logic for completed shoots to display albums and additional content
  const isCompletedTab = selectedTab === 'completed';
  
  const handleShootSelect = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsDetailOpen(true);
  };
  
  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedShoot(null);
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
          />
          
          <ShootsContent 
            filteredShoots={filteredShoots}
            viewMode={viewMode}
            onShootSelect={handleShootSelect}
          />
        </div>
        
        <ShootDetail 
          shoot={selectedShoot}
          isOpen={isDetailOpen}
          onClose={closeDetail}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default Shoots;
