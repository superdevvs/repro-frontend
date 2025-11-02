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

  // Extracted so we can reuse after uploads
  const refreshShoots = async () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');

      if (!token) {
        throw new Error("No auth token found in localStorage");
      }

      try {
        // Role-aware endpoint selection
        const base = import.meta.env.VITE_API_URL;
        const url = (role === 'photographer')
          ? `${base}/api/photographer/shoots`
          : `${base}/api/shoots`;
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch shoots');
        }

        const data = await res.json();

        const mappedShoots: ShootData[] = data.data.map((item: any) => ({
          id: String(item.id),
          scheduledDate: item.scheduled_date,
          time: item.time,

          client: {
            id: String(item.client.id),
            name: item.client.name,
            email: item.client.email,
            company: item.client.company_name || '',
            phone: item.client.phonenumber,
            totalShoots: 0, // You can fetch total shoots separately if needed
          },

          location: {
            address: item.address,
            address2: '',
            city: item.city,
            state: item.state,
            zip: item.zip,
            fullAddress: `${item.address}, ${item.city}, ${item.state} ${item.zip}`,
          },

          photographer: {
            id: String(item.photographer.id),
            name: item.photographer.name,
            avatar: item.photographer.avatar,
          },

          services: [item.service?.name || 'Unknown'],

          payment: {
            baseQuote: parseFloat(item.base_quote),
            taxRate: 0, // Not provided in API, adjust if available
            taxAmount: parseFloat(item.tax_amount),
            totalQuote: parseFloat(item.total_quote),
            totalPaid: item.payment_status === 'paid' ? parseFloat(item.total_quote) : 0,
            lastPaymentDate: undefined,
            lastPaymentType: item.payment_type || undefined,
          },

          status: item.status,
          notes: item.notes,
          createdBy: item.created_by,
          completedDate: undefined,

          files: Array.isArray(item.files)
            ? item.files.map((file: any) => ({
                id: String(file.id),
                filename: file.filename,
                storedFilename: file.stored_filename,
                path: file.path,                  // local storage path if present
                dropboxPath: file.dropbox_path,   // dropbox path if present
                url: file.url,                    // accessor should provide a usable URL when available
                fileType: file.file_type,
                fileSize: file.file_size,
                formattedSize: file.formatted_size,
                uploadedBy: file.uploaded_by,
                workflowStage: file.workflow_stage, // 'todo' or 'completed'
                isImage: (file.file_type || '').startsWith('image/'),
                isVideo: (file.file_type || '').startsWith('video/'),
              }))
            : [],
        }));

        setShoots(mappedShoots);
        console.log("Mapped shoots:", mappedShoots);
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Could not fetch shoots." });
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    refreshShoots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // if (selectedTab === 'pending') return matchesSearch && shoot.status === 'pending';
    // if (selectedTab === 'hold') return matchesSearch && shoot.status === 'hold';
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
  
  // Add the updateShoot function here
  const updateShoot = async (id: number, updatedData: any) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("No auth token found");
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/shoots/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Update failed");
      }

      const data = await res.json();
      console.log("Updated shoot:", data);
      return data;

    } catch (err) {
      console.error("Update shoot error:", err);
      toast({ 
        title: "Error", 
        description: "Failed to update shoot status." 
      });
      throw err;
    }
  };

    const handleUploadComplete = async (_files: File[]) => {
    try {
      setIsUploadDialogOpen(false);
      await refreshShoots();
      if (selectedShoot) {
        // Re-select the updated shoot from the refreshed list
        setSelectedShoot(prev => {
          const found = (prev && shoots.find(s => s.id === prev.id)) || null;
          return found;
        });
      }
    } catch {}
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
          {/* {canSeeQuickBooking && (
            <QuickBookingCard />
          )} */}
          
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
            onUploadMedia={
              // Photographers can upload during scheduled; everyone can upload during completed (editor/admin)
              (role === 'photographer' && selectedTab === 'scheduled') || isCompletedTab
                ? handleUploadMedia
                : undefined
            }
            showMedia={true}
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

