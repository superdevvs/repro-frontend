
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { PhotographerForm } from '@/components/photographers/PhotographerForm';
import { PhotographerProfile } from '@/components/photographers/PhotographerProfile';
import { useToast } from '@/hooks/use-toast';
import { PhotographerFromShoots } from '@/types/photographers';
import { usePhotographersData } from '@/components/photographers/usePhotographersData';
import { PhotographersHeader } from '@/components/photographers/PhotographersHeader';
import { PhotographerFilter } from '@/components/photographers/PhotographerFilter';
import { PhotographerCard } from '@/components/photographers/PhotographerCard';
import { EmptyPhotographerState } from '@/components/photographers/EmptyPhotographerState';

const Photographers = () => {
  const { toast } = useToast();
  const { photographersList, setPhotographersList } = usePhotographersData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState<PhotographerFromShoots | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // Filter photographers based on search term and active filter
  const filteredPhotographers = photographersList.filter(photographer => {
    const matchesSearch = 
      photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photographer.location?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (photographer.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && photographer.status === activeFilter.toLowerCase();
  });

  const handleAddPhotographer = (data: any) => {
    console.log("Adding new photographer with data:", data);
    
    // Create unique ID for new photographer
    const newId = `${Date.now()}`;
    
    const newPhotographer: PhotographerFromShoots = {
      id: newId,
      name: data.name,
      email: data.email,
      avatar: data.avatar || `https://ui.shadcn.com/avatars/0${Math.floor(Math.random() * 5) + 1}.png`,
      location: data.location,
      rating: 0,
      shootsCompleted: 0,
      specialties: data.specialties,
      status: data.status,
    };
    
    setPhotographersList(prev => [...prev, newPhotographer]);
    setFormOpen(false);
    
    // Display success message
    toast({
      title: 'Photographer Added',
      description: `${data.name} has been added to the directory.`,
    });
  };

  const handleViewProfile = (photographer: PhotographerFromShoots) => {
    setSelectedPhotographer(photographer);
    setProfileOpen(true);
  };

  const handleEditPhotographer = () => {
    setProfileOpen(false);
    setEditOpen(true);
  };

  const handleEditDirectly = (photographer: PhotographerFromShoots) => {
    setSelectedPhotographer(photographer);
    setEditOpen(true);
  };

  const handleUpdatePhotographer = (data: any) => {
    // Update the photographer in the list
    setPhotographersList(prev => 
      prev.map(p => 
        p.id === selectedPhotographer?.id 
          ? { 
              ...p, 
              name: data.name, 
              email: data.email, 
              location: data.location, 
              specialties: data.specialties, 
              status: data.status,
              avatar: data.avatar || p.avatar,
            } 
          : p
      )
    );
    
    setEditOpen(false);
    
    // Display success message
    toast({
      title: 'Photographer Updated',
      description: `${data.name}'s profile has been updated.`,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setActiveFilter('All');
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Enhanced Header */}
          <PhotographersHeader onAddClick={() => setFormOpen(true)} />
          
          {/* Improved Search and filter */}
          <PhotographerFilter 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
          
          {/* Photographers grid with enhanced UI */}
          {filteredPhotographers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPhotographers.map((photographer) => (
                <PhotographerCard 
                  key={photographer.id}
                  photographer={photographer}
                  onEdit={handleEditDirectly}
                  onViewProfile={handleViewProfile}
                />
              ))}
            </div>
          ) : (
            <EmptyPhotographerState 
              searchTerm={searchTerm}
              onClearFilters={handleClearFilters}
            />
          )}
        </div>
      </PageTransition>
      
      {/* Add Photographer Form */}
      <PhotographerForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        onSubmit={handleAddPhotographer} 
      />

      {/* View Photographer Profile */}
      {selectedPhotographer && (
        <PhotographerProfile
          photographer={{
            id: selectedPhotographer.id,
            name: selectedPhotographer.name,
            email: selectedPhotographer.email,
            avatar: selectedPhotographer.avatar || '',
            location: selectedPhotographer.location || '',
            rating: typeof selectedPhotographer.rating === 'string' ? 
              parseFloat(selectedPhotographer.rating) : (selectedPhotographer.rating || 0),
            shootsCompleted: selectedPhotographer.shootsCompleted,
            specialties: selectedPhotographer.specialties || [],
            status: selectedPhotographer.status
          }}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          onEdit={handleEditPhotographer}
        />
      )}

      {/* Edit Photographer Form */}
      {selectedPhotographer && (
        <PhotographerForm 
          open={editOpen} 
          onOpenChange={setEditOpen} 
          onSubmit={handleUpdatePhotographer}
          initialData={{
            id: selectedPhotographer.id,
            name: selectedPhotographer.name,
            email: selectedPhotographer.email,
            location: selectedPhotographer.location || '',
            specialties: selectedPhotographer.specialties || [],
            status: selectedPhotographer.status,
            avatar: selectedPhotographer.avatar || ''
          }}
        />
      )}
    </DashboardLayout>
  );
};

export default Photographers;
