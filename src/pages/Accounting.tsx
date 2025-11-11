
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { AccountingHeader } from '@/components/accounting/AccountingHeader';
import { OverviewCards } from '@/components/accounting/OverviewCards';
import { RevenueCharts } from '@/components/accounting/RevenueCharts';
import { InvoiceList } from '@/components/accounting/InvoiceList';
import { PaymentsSummary } from '@/components/accounting/PaymentsSummary';
import { UpcomingPayments } from '@/components/accounting/UpcomingPayments';
import { CreateInvoiceDialog } from '@/components/invoices/CreateInvoiceDialog';
import { InvoiceViewDialog } from '@/components/invoices/InvoiceViewDialog';
import { PaymentDialog, PaymentResult } from '@/components/invoices/PaymentDialog';
import { BatchInvoiceDialog } from '@/components/accounting/BatchInvoiceDialog';
import { InvoiceData } from '@/utils/invoiceUtils';
import { useToast } from '@/hooks/use-toast';
import { EditInvoiceDialog } from '@/components/invoices/EditInvoiceDialog';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePermission } from '@/hooks/usePermission';

// We're reusing the existing initial invoices data for now
import { initialInvoices } from '@/components/accounting/data';

const AccountingPage = () => {
  const { toast } = useToast();
  const { role } = useAuth(); // Use the correct AuthProvider
  const { can } = usePermission();
  const [invoices, setInvoices] = useState<InvoiceData[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Use permission system to check if user has admin capabilities
  const canCreateInvoice = can('invoices', 'create');
  const canEditInvoice = can('invoices', 'update');
  const canMarkAsPaid = can('invoices', 'approve');
  const isAdmin = ['admin', 'superadmin'].includes(role || '');

  const handleDownloadInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Invoice Generated",
      description: `Invoice ${invoice.id} has been downloaded successfully.`,
      variant: "default",
    });
  };

  const handleViewInvoice = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handlePayInvoice = (invoice: InvoiceData) => {
    if (!canMarkAsPaid) return; // Use permission check
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };
  
  const handleEditInvoice = (invoice: InvoiceData) => {
    if (!canEditInvoice) return; // Use permission check
    setSelectedInvoice(invoice);
    setEditDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
  };

  const closePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handlePaymentComplete = ({ invoice, error, validationErrors }: PaymentResult) => {
    if (invoice) {
      const invoiceId = String(invoice.id);

      const statusLabel = invoice.status ? String(invoice.status) : 'paid';

      setInvoices(currentInvoices => {
        const updatedInvoices = currentInvoices.map(existing => {
          if (String(existing.id) === invoiceId) {
            return {
              ...existing,
              ...invoice,
              status: invoice.status ?? existing.status,
              paymentMethod: invoice.paymentMethod || existing.paymentMethod,
              paymentMethodCode: invoice.paymentMethodCode ?? existing.paymentMethodCode,
            };
          }
          return existing;
        });

        if (!updatedInvoices.some(existing => String(existing.id) === invoiceId)) {
          return [invoice, ...currentInvoices];
        }

        return updatedInvoices;
      });

      setSelectedInvoice(prev => {
        if (prev && String(prev.id) === invoiceId) {
          return {
            ...prev,
            ...invoice,
          };
        }
        return prev;
      });

      toast({
        title: "Payment Successful",
        description: `Invoice ${invoice.number || invoiceId} has been marked as ${statusLabel}.`,
        variant: "default",
      });
      setPaymentDialogOpen(false);
      return;
    }

    const details = validationErrors && validationErrors.length > 0
      ? validationErrors.join('; ')
      : null;

    toast({
      title: "Payment Failed",
      description: details ? `${error ?? 'Unable to mark invoice as paid.'} (${details})` : (error ?? 'Unable to mark invoice as paid.'),
      variant: "destructive",
    });
  };

  const handleCreateInvoice = (newInvoice: InvoiceData) => {
    setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.id} has been created successfully.`,
      variant: "default",
    });
  };
  
  const handleCreateBatchInvoices = (newInvoices: InvoiceData[]) => {
    setInvoices(prevInvoices => [...newInvoices, ...prevInvoices]);
    toast({
      title: "Batch Invoices Created",
      description: `${newInvoices.length} invoices have been created successfully.`,
      variant: "default",
    });
  };

  const handleSendReminder = (invoice: InvoiceData) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${invoice.client} for invoice ${invoice.id}.`,
      variant: "default",
    });
  };

  const handleInvoiceEdit = (updatedInvoice: InvoiceData) => {
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === updatedInvoice.id ? { ...inv, ...updatedInvoice } : inv
      )
    );
    setEditDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6 pb-8">
          <AccountingHeader 
            onCreateInvoice={() => canCreateInvoice && setCreateDialogOpen(true)}
            onCreateBatch={() => canCreateInvoice && setBatchDialogOpen(true)}
          />
          
          <OverviewCards invoices={invoices} timeFilter={timeFilter} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueCharts 
                invoices={invoices} 
                timeFilter={timeFilter} 
                onTimeFilterChange={setTimeFilter} 
              />
            </div>
            <div className="lg:col-span-1">
              <PaymentsSummary invoices={invoices} />
            </div>
          </div>
          
          <InvoiceList 
            data={{ invoices }}
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
            onDownload={handleDownloadInvoice}
            onPay={handlePayInvoice}
            onSendReminder={handleSendReminder}
            isAdmin={isAdmin} // Pass down admin status
          />
          
          <UpcomingPayments invoices={invoices} />
        </div>
      </PageTransition>

      {selectedInvoice && (
        <InvoiceViewDialog
          isOpen={viewDialogOpen}
          onClose={closeViewDialog}
          invoice={selectedInvoice}
        />
      )}

      {selectedInvoice && canMarkAsPaid && (
        <PaymentDialog
          isOpen={paymentDialogOpen}
          onClose={closePaymentDialog}
          invoice={selectedInvoice}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {canCreateInvoice && (
        <CreateInvoiceDialog
          isOpen={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onInvoiceCreate={handleCreateInvoice}
        />
      )}
      
      {canCreateInvoice && (
        <BatchInvoiceDialog
          isOpen={batchDialogOpen}
          onClose={() => setBatchDialogOpen(false)}
          onCreateBatch={handleCreateBatchInvoices}
        />
      )}

      {selectedInvoice && canEditInvoice && (
        <EditInvoiceDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          invoice={selectedInvoice}
          onInvoiceEdit={handleInvoiceEdit}
        />
      )}
    </DashboardLayout>
  );
};

export default AccountingPage;
