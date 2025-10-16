
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
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Always show media tab
  const showMediaTab = true;

  // 👇 1. Agar shoot object ke andar invoice data hai:
  const currentInvoice: InvoiceData | null = (shoot as any).invoice ?? null;

  // derive isClient from role (so we can pass it to ShootSettingsTab)
  const isClient = role === 'client';

  // 👇 2. Common handler jo InvoiceList aur ShootSettingsTab dono use karenge
  const handlePay = async (invoice: InvoiceData) => {
    console.log("Process payment for invoice:", invoice);

    // Example: optimistic UI update + toast. Replace with real API call to mark invoice paid.
    try {
      // Example API call (uncomment and adapt if your backend supports it)
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoices/${invoice.id}/pay`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ method: invoice.paymentMethod }),
      // });
      // const data = await res.json();

      // For now: just toast and console
      toast({ title: "Payment processed", description: `Invoice ${invoice.id} marked paid (simulated).` });
      console.log("Payment processed (simulated) for", invoice.id);
    } catch (err) {
      console.error("Payment failed", err);
      toast({ title: "Payment failed", description: "Could not process payment." });
    }
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
          isClient={isClient}                // ✅ pass isClient derived from role
          currentInvoice={currentInvoice}   // ✅ pass invoice if present
          onProcessPayment={handlePay}      // ✅ pass handler to be called after payment
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
