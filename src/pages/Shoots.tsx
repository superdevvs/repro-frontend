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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/photographer/shoots`, {
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
                path: file.path,
                url: file.url, // This comes from the accessor in your ShootFile model
                fileType: file.file_type,
                fileSize: file.file_size,
                formattedSize: file.formatted_size, // Also comes from accessor
                uploadedBy: file.uploaded_by,
                isImage: file.file_type?.startsWith('image/'),
                isVideo: file.file_type?.startsWith('video/'),
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

  const handleUploadComplete = async (files: File[]) => {
    console.log("handleUploadComplete called with files:", files);
    
    // if (!selectedShoot) {
    //   console.error("No selectedShoot available");
    //   return;
    // }
    
    // console.log("Selected shoot:", selectedShoot);
    
    // const token = localStorage.getItem('authToken');
    // if (!token) {
    //   console.error("No auth token found");
    //   toast({
    //     title: "Error",
    //     description: "Authentication token not found. Please log in again."
    //   });
    //   return;
    // }

    // console.log("Auth token found:", token.substring(0, 10) + "...");

    // try {
    //   // Create FormData to send files
    //   const formData = new FormData();
      
    //   // Append each file to FormData
    //   files.forEach((file, index) => {
    //     console.log(`Appending file ${index}:`, file.name, file.size, file.type);
    //     formData.append(`files[${index}]`, file);
    //   });

    //   // Log FormData contents (for debugging)
    //   console.log("FormData entries:");
    //   for (let [key, value] of formData.entries()) {
    //     console.log(key, value);
    //   }

    //   const uploadUrl = `${import.meta.env.VITE_API_URL}/api/shoots/${selectedShoot.id}/upload`;
    //   console.log("Upload URL:", uploadUrl);

    //   // Make API call to upload files
    //   console.log("Making API call to upload files...");
    //   const response = await fetch(uploadUrl, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${token}`,
    //       'Accept': 'application/json',
    //       // Don't set Content-Type header - let the browser set it for FormData
    //     },
    //     body: formData,
    //   });

    //   console.log("Response status:", response.status);
    //   console.log("Response ok:", response.ok);

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     console.error("Upload failed with error:", errorData);
    //     throw new Error(errorData.message || 'Upload failed');
    //   }

    //   const result = await response.json();
    //   console.log("Upload successful:", result);

    //   // Update the shoot status to completed if needed
    //   if (selectedShoot.status !== 'completed') {
    //     console.log("Updating shoot status to completed...");
    //     await updateShoot(parseInt(selectedShoot.id), {
    //       status: 'completed'
    //     });
        
    //     // Update local state
    //     setShoots(prevShoots => 
    //       prevShoots.map(shoot => 
    //         shoot.id === selectedShoot.id 
    //           ? { ...shoot, status: 'completed' }
    //           : shoot
    //       )
    //     );
    //   }

    //   setIsUploadDialogOpen(false);
    //   toast({
    //     title: "Upload Complete",
    //     description: `${files.length} files have been uploaded successfully.`
    //   });

    // } catch (error) {
    //   console.error("Upload error:", error);
    //   toast({
    //     title: "Upload Failed",
    //     description: error instanceof Error ? error.message : "Failed to upload files. Please try again."
    //   });
    // }
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
