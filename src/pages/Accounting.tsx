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
import { PaymentDialog } from '@/components/invoices/PaymentDialog';
import { BatchInvoiceDialog } from '@/components/accounting/BatchInvoiceDialog';
import { InvoiceData } from '@/utils/invoiceUtils';
import { useToast } from '@/hooks/use-toast';
import { EditInvoiceDialog } from '@/components/invoices/EditInvoiceDialog';

// We're reusing the existing initial invoices data for now
import { initialInvoices } from '@/components/accounting/data';

const AccountingPage = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceData[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };
  
  const handleEditInvoice = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setEditDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
  };

  const closePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handlePaymentComplete = (invoiceId: string, paymentMethod: string) => {
    setInvoices(currentInvoices => 
      currentInvoices.map(invoice => 
        invoice.id === invoiceId 
          ? { 
              ...invoice, 
              status: 'paid', 
              paymentMethod: paymentMethod 
            } 
          : invoice
      )
    );
    
    toast({
      title: "Payment Successful",
      description: `Invoice ${invoiceId} has been marked as paid.`,
      variant: "default",
    });
    setPaymentDialogOpen(false);
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
            onCreateInvoice={() => setCreateDialogOpen(true)}
            onCreateBatch={() => setBatchDialogOpen(true)}
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

      {selectedInvoice && (
        <PaymentDialog
          isOpen={paymentDialogOpen}
          onClose={closePaymentDialog}
          invoice={selectedInvoice}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      <CreateInvoiceDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onInvoiceCreate={handleCreateInvoice}
      />
      
      <BatchInvoiceDialog
        isOpen={batchDialogOpen}
        onClose={() => setBatchDialogOpen(false)}
        onCreateBatch={handleCreateBatchInvoices}
      />

      {selectedInvoice && (
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
