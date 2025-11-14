
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { InvoiceData } from '@/utils/invoiceUtils';

interface InvoiceViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData;
}

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  try {
    return format(new Date(value), 'MMM d, yyyy');
  } catch (error) {
    return value;
  }
};

const resolveAmount = (invoice: InvoiceData) =>
  typeof invoice.total === 'number' ? invoice.total : invoice.amount;

export function InvoiceViewDialog({ isOpen, onClose, invoice }: InvoiceViewDialogProps) {
  const statusKey = invoice.status?.toLowerCase?.() ?? '';
  const amountDisplay = resolveAmount(invoice);
  const balanceDue = typeof invoice.balance_due === 'number'
    ? invoice.balance_due
    : statusKey === 'paid'
      ? 0
      : amountDisplay;

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
                <p>{formatDate(invoice.date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                <p>{formatDate(invoice.dueDate)}</p>
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
                <p className="font-medium">${amountDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Balance Due</p>
                <p className={`font-medium ${balanceDue > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                  ${balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent At</p>
                <p>{formatDate(invoice.sent_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid At</p>
                <p>{formatDate(invoice.paid_at)}</p>
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
