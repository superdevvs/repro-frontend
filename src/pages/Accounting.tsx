
import React, { useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '@/components/auth/AuthProvider';
import { usePermission } from '@/hooks/usePermission';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  fetchInvoices,
  InvoicePaginator,
  InvoicePaginationLinks,
  InvoicePaginationMeta,
} from '@/services/invoiceService';

const AccountingPage = () => {
  const { toast } = useToast();
  const { role } = useAuth(); // Use the correct AuthProvider
  const { can } = usePermission();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState<InvoicePaginationMeta | undefined>();
  const [paginationLinks, setPaginationLinks] = useState<InvoicePaginationLinks | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Use permission system to check if user has admin capabilities
  const canCreateInvoice = can('invoices', 'create');
  const canEditInvoice = can('invoices', 'update');
  const canMarkAsPaid = can('invoices', 'approve');
  const isAdmin = ['admin', 'superadmin'].includes(role || '');

  const invoiceQuery = useQuery<InvoicePaginator<InvoiceData>, AxiosError>({
    queryKey: ['admin-invoices', currentPage, perPage, role ?? ''],
    queryFn: () =>
      fetchInvoices<InvoiceData>({
        page: currentPage,
        per_page: perPage,
        with_items: true,
        ...(role ? { role } : {}),
      }),
    keepPreviousData: true,
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (invoiceQuery.data) {
      setInvoices(invoiceQuery.data.data ?? []);
      setPaginationMeta(invoiceQuery.data.meta);
      setPaginationLinks(invoiceQuery.data.links);
    }
  }, [invoiceQuery.data]);

  const invoiceErrorMessage = useMemo(() => {
    if (!invoiceQuery.error) return undefined;
    const responseData = invoiceQuery.error.response?.data as { message?: string; error?: string } | undefined;
    return responseData?.message || responseData?.error || invoiceQuery.error.message;
  }, [invoiceQuery.error]);

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    const lastPage = paginationMeta?.last_page;
    if (lastPage && page > lastPage) return;
    setCurrentPage(page);
  };

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
    setPaginationMeta(prev =>
      prev ? { ...prev, total: typeof prev.total === 'number' ? prev.total + 1 : prev.total } : prev
    );
    toast({
      title: "Invoice Created",
      description: `Invoice ${newInvoice.id} has been created successfully.`,
      variant: "default",
    });
  };

  const handleCreateBatchInvoices = (newInvoices: InvoiceData[]) => {
    setInvoices(prevInvoices => [...newInvoices, ...prevInvoices]);
    setPaginationMeta(prev =>
      prev
        ? {
            ...prev,
            total:
              typeof prev.total === 'number'
                ? prev.total + newInvoices.length
                : prev.total,
          }
        : prev
    );
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
            invoices={invoices}
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
            onDownload={handleDownloadInvoice}
            onPay={handlePayInvoice}
            onSendReminder={handleSendReminder}
            isAdmin={isAdmin} // Pass down admin status
            isLoading={invoiceQuery.isLoading}
            isFetching={invoiceQuery.isFetching}
            isError={invoiceQuery.isError}
            errorMessage={invoiceErrorMessage}
            onRetry={invoiceQuery.refetch}
            pagination={{ meta: paginationMeta, links: paginationLinks }}
            onPageChange={handlePageChange}
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
