import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceData } from '@/utils/invoiceUtils';

interface BatchInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBatch: (invoices: InvoiceData[]) => void;
}

export function BatchInvoiceDialog({ isOpen, onClose, onCreateBatch }: BatchInvoiceDialogProps) {
  const [clients, setClients] = useState([
    { name: "ABC Properties", selected: false },
    { name: "XYZ Realty", selected: false },
    { name: "John Smith Homes", selected: false },
    { name: "Coastal Properties", selected: false },
    { name: "United Real Estate", selected: false },
  ]);

  const [services, setServices] = useState([
    { name: "Photography", selected: false, price: 150 },
    { name: "Video", selected: false, price: 250 },
    { name: "3D Tour", selected: false, price: 200 },
    { name: "Floor Plan", selected: false, price: 100 },
    { name: "Drone", selected: false, price: 175 },
  ]);

  const toggleClient = (index: number) => {
    const updatedClients = [...clients];
    updatedClients[index].selected = !updatedClients[index].selected;
    setClients(updatedClients);
  };

  const toggleService = (index: number) => {
    const updatedServices = [...services];
    updatedServices[index].selected = !updatedServices[index].selected;
    setServices(updatedServices);
  };

  const handleCreateBatch = () => {
    const selectedClients = clients.filter(client => client.selected);
    const selectedServices = services.filter(service => service.selected);
    
    if (selectedClients.length === 0 || selectedServices.length === 0) {
      return; // Validate selection
    }
    
    const newInvoices = selectedClients.map((client, index) => {
      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 15); // Due in 15 days
      
      const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
      const invoiceId = `INV-BATCH-${Date.now()}-${index}`;
      
      return {
        id: invoiceId,
        number: invoiceId,
        client: client.name,
        property: "Multiple Properties",
        date: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        amount: totalAmount,
        status: 'pending',
        services: selectedServices.map(s => s.name),
        paymentMethod: 'Pending'
      } as InvoiceData;
    });
    
    onCreateBatch(newInvoices);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Batch Invoices</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Clients</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {clients.map((client, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`client-${index}`}
                    checked={client.selected}
                    onCheckedChange={() => toggleClient(index)}
                  />
                  <Label htmlFor={`client-${index}`} className="text-sm font-normal">
                    {client.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Select Services</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${index}`}
                      checked={service.selected}
                      onCheckedChange={() => toggleService(index)}
                    />
                    <Label htmlFor={`service-${index}`} className="text-sm font-normal">
                      {service.name}
                    </Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ${service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Add Property Note (Optional)</Label>
            <Input placeholder="Add a general property note for all invoices" />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreateBatch}>Create Batch</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
