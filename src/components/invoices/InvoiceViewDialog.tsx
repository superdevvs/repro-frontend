
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon } from "lucide-react";
import { InvoiceData, generateInvoicePDF } from '@/utils/invoiceUtils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface InvoiceViewDialogProps {
  invoice: InvoiceData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceViewDialog({ invoice, isOpen, onClose }: InvoiceViewDialogProps) {
  const { toast } = useToast();

  if (!invoice) return null;

  const handleDownloadInvoice = () => {
    try {
      generateInvoicePDF(invoice);
      toast({
        title: "Invoice Generated",
        description: `Invoice ${invoice.id} has been downloaded successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Error Generating Invoice",
        description: "There was a problem generating the invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Invoice #{invoice.id}</span>
            {getStatusBadge(invoice.status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Client</h3>
            <p>{invoice.client}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Property</h3>
            <p>{invoice.property}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Invoice Date</h3>
              <p>{format(new Date(invoice.date), "MM/dd/yyyy")}</p>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-sm">Due Date</h3>
              <p>{format(new Date(invoice.dueDate), "MM/dd/yyyy")}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Services</h3>
            <ul className="list-disc pl-5">
              {invoice.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Payment Method</h3>
            <p>{invoice.paymentMethod}</p>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-medium text-sm">Amount</h3>
            <p className="text-lg font-bold">${invoice.amount.toFixed(2)}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleDownloadInvoice}>
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
