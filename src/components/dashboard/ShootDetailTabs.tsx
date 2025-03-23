
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShootDetailContent } from "@/components/dashboard/ShootDetailContent";
import { ShootNotesTab } from "@/components/dashboard/ShootNotesTab";
import { ShootMediaTab } from "@/components/dashboard/ShootMediaTab";
import { ShootData } from '@/types/shoots';

interface ShootDetailTabsProps {
  shoot: ShootData;
  activeTab: string;
  setActiveTab: (value: string) => void;
  isAdmin: boolean;
  isPhotographer: boolean;
  role: string;
}

export function ShootDetailTabs({ 
  shoot, 
  activeTab, 
  setActiveTab, 
  isAdmin, 
  isPhotographer,
  role
}: ShootDetailTabsProps) {
  // If the shoot is completed, we should allow media tab regardless of whether media exists
  const showMediaTab = shoot.status === 'completed' || (shoot.media?.photos && shoot.media.photos.length > 0);
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="media" disabled={!showMediaTab}>Media</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="mt-4">
        <ShootDetailContent shoot={shoot} isAdmin={isAdmin} />
      </TabsContent>
      
      <TabsContent value="notes" className="mt-4 space-y-6">
        <ShootNotesTab 
          shoot={shoot} 
          isAdmin={isAdmin} 
          isPhotographer={isPhotographer} 
          role={role} 
        />
      </TabsContent>
      
      <TabsContent value="media" className="mt-4">
        <ShootMediaTab shoot={shoot} isPhotographer={isPhotographer} />
      </TabsContent>
    </Tabs>
  );
}
