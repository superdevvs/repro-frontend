
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InvoiceData } from '@/utils/invoiceUtils';

interface InvoiceViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData;
}

export function InvoiceViewDialog({ isOpen, onClose, invoice }: InvoiceViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invoice #{invoice.number}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client</p>
                <p>{invoice.client}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Property</p>
                <p>{invoice.property}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{invoice.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p>{invoice.dueDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className={`capitalize ${
                  invoice.status === 'paid' 
                    ? 'text-green-600 dark:text-green-400'
                    : invoice.status === 'overdue' 
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {invoice.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="font-medium">${invoice.amount}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-2">Services</p>
              <ul className="list-disc list-inside space-y-1">
                {invoice.services.map((service, i) => (
                  <li key={i} className="text-sm">{service}</li>
                ))}
              </ul>
            </div>

            {invoice.status === 'paid' && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <p>{invoice.paymentMethod}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
