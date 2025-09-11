
// import React from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ShootDetailContent } from "@/components/dashboard/ShootDetailContent";
// import { ShootNotesTab } from "@/components/dashboard/ShootNotesTab";
// import { ShootMediaTab } from "@/components/dashboard/ShootMediaTab";
// import { ShootSettingsTab } from "@/components/dashboard/ShootSettingsTab";
// import { ShootData } from '@/types/shoots';

// interface ShootDetailTabsProps {
//   shoot: ShootData;
//   activeTab: string;
//   setActiveTab: (value: string) => void;
//   isAdmin: boolean;
//   isPhotographer: boolean;
//   role: string;
// }

// export function ShootDetailTabs({ 
//   shoot, 
//   activeTab, 
//   setActiveTab, 
//   isAdmin, 
//   isPhotographer,
//   role
// }: ShootDetailTabsProps) {
//   // Always show media tab
//   const showMediaTab = true;
  
//   return (
//     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//       <TabsList className="grid w-full grid-cols-4">
//         <TabsTrigger value="details">Details</TabsTrigger>
//         <TabsTrigger value="notes">Notes</TabsTrigger>
//         <TabsTrigger value="media">Media</TabsTrigger>
//         <TabsTrigger value="settings" disabled={!showMediaTab}>Settings</TabsTrigger>
//       </TabsList>
      
//       <TabsContent value="details" className="mt-4">
//         <ShootDetailContent shoot={shoot} isAdmin={isAdmin} />
//       </TabsContent>
      
//       <TabsContent value="notes" className="mt-4 space-y-6">
//         <ShootNotesTab 
//           shoot={shoot} 
//           isAdmin={isAdmin} 
//           isPhotographer={isPhotographer} 
//           role={role} 
//         />
//       </TabsContent>
      
//       <TabsContent value="media" className="mt-4">
//         <ShootMediaTab shoot={shoot} isPhotographer={isPhotographer} />
//       </TabsContent>

//       <TabsContent value="settings" className="mt-4">
//         <ShootSettingsTab 
//           shoot={shoot}
//           isAdmin={isAdmin}
//           currentInvoice={someInvoiceObject}
//           onProcessPayment={onPay}
//           onUpdate={(updated) => {
//             console.log("Shoot updated:", updated);
//           }}
//           onDelete={() => {
//             console.log("Shoot deleted");
//           }}
//         />
//       </TabsContent>
//     </Tabs>
//   );
// }


import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShootDetailContent } from "@/components/dashboard/ShootDetailContent";
import { ShootNotesTab } from "@/components/dashboard/ShootNotesTab";
import { ShootMediaTab } from "@/components/dashboard/ShootMediaTab";
import { ShootSettingsTab } from "@/components/dashboard/ShootSettingsTab";
import { ShootData } from '@/types/shoots';
import { InvoiceData } from '@/utils/invoiceUtils';   // 👈 import InvoiceData type

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
  // Always show media tab
  const showMediaTab = true;

  // 👇 1. Agar shoot object ke andar invoice data hai:
  const currentInvoice: InvoiceData | null = (shoot as any).invoice ?? null;

  // 👇 2. Common handler jo InvoiceList aur ShootSettingsTab dono use karenge
  const handlePay = (invoice: InvoiceData) => {
    console.log("Process payment for invoice:", invoice);
    // yaha aap wahi logic daalo jo InvoiceList ke onPay me hai:
    // - API call mark as paid
    // - toast show
    // - state update
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="media">Media</TabsTrigger>
        <TabsTrigger value="settings" disabled={!showMediaTab}>Settings</TabsTrigger>
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

      <TabsContent value="settings" className="mt-4">
        <ShootSettingsTab 
          shoot={shoot}
          isAdmin={isAdmin}
          currentInvoice={currentInvoice}      // ✅ ab real object pass hoga
          onProcessPayment={handlePay}         // ✅ ab real handler pass hoga
          onUpdate={(updated) => {
            console.log("Shoot updated:", updated);
          }}
          onDelete={() => {
            console.log("Shoot deleted");
          }}
        />
      </TabsContent>
    </Tabs>
  );
}
