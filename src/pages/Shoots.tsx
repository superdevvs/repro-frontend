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

// Sample demo images from Unsplash
const demoImages = [
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
];

const Shoots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('scheduled');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [shoots, setShoots] = useState<ShootData[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShoots = async () => {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        throw new Error("No auth token found in localStorage");
      }
      
      try {
        const res = await fetch('http://localhost:8000/api/photographer/shoots', {
          headers: {
            'Authorization': `Bearer ${token}`, // adjust if you store token differently
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch shoots');
        }

        const data = await res.json();
        setShoots(data.data); // assuming data comes as { data: [...] }
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Could not fetch shoots." });
      } finally {
        setLoading(false);
      }
    };

    fetchShoots();
  }, []);

  
  // Filter shoots based on user role
  const userFilteredShoots = shoots.filter(shoot => {
    if (user && user.role === 'client') {
      return shoot.client.name === user.name;
    }
    return true;
  });
  
  // Filter shoots based on search and tab
  const filteredShoots = userFilteredShoots.filter(shoot => {
    // const matchesSearch = 
    //   shoot.location.fullAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   shoot.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   shoot.photographer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSearch = shoot;
    
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
  // Show QuickBookingCard to admin, superadmin, and client users
  const canSeeQuickBooking = ['admin', 'superadmin', 'client'].includes(role || '');
  
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
    
    // Create valid image URLs from demo images for testing purposes
    // In a real app, you would upload these files to a server and get real URLs back
    const photoUrls = files
      .filter(file => file.type.startsWith('image/'))
      .map((_, index) => {
        // Use Unsplash demo images that actually load
        return demoImages[index % demoImages.length];
      });
    
      const updateShoot = async (id: number, updatedData: any) => {
      const token = localStorage.getItem('authToken');
      try {
        const res = await fetch(`http://localhost:8000/api/shoots/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData),
        });

        if (!res.ok) throw new Error("Update failed");

        const data = await res.json();
        console.log("Updated shoot:", data);

        // Optionally re-fetch shoots or update local state
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to update shoot." });
      }
      };

    
    setIsUploadDialogOpen(false);
    toast({
      title: "Upload Complete",
      description: `${files.length} files have been uploaded successfully.`
    });
    
    console.log("Upload complete. New photos:", photoUrls);
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
          
          {/* Quick Booking Card - Show for admin, superadmin, and client users */}
          {canSeeQuickBooking && (
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
