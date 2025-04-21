
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { InvoiceViewDialog } from '@/components/invoices/InvoiceViewDialog';
import { InvoiceData } from '@/utils/invoiceUtils';

interface InvoiceListProps {
  data: {
    invoices: InvoiceData[];
  };
  onView: (invoice: InvoiceData) => void;
  onEdit: (invoice: InvoiceData) => void;
  onDownload: (invoice: InvoiceData) => void;
  onPay: (invoice: InvoiceData) => void;
  onSendReminder: (invoice: InvoiceData) => void;
}

export function InvoiceList({ data, onView, onEdit, onDownload, onPay, onSendReminder }: InvoiceListProps) {
  const { toast } = useToast();
  const [viewInvoiceDialogOpen, setViewInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredInvoices = activeTab === 'all' 
    ? data.invoices 
    : data.invoices.filter(invoice => invoice.status === activeTab);

  const handleViewInvoice = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setViewInvoiceDialogOpen(true);
    onView(invoice);
  };

  const handleDownloadInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Invoice downloaded",
      description: `Invoice #${invoice.number} has been downloaded.`
    });
    onDownload(invoice);
  };

  const handleSendInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Invoice sent",
      description: `Invoice #${invoice.number} has been sent to ${invoice.client}.`
    });
  };

  const handlePrintInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Printing invoice",
      description: `Invoice #${invoice.number} sent to printer.`
    });
  };

  const handleEditInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Edit invoice",
      description: `Edit mode for invoice #${invoice.number}.`
    });
    onEdit(invoice);
  };

  const handleDeleteInvoice = (invoice: InvoiceData) => {
    toast({
      title: "Invoice deleted",
      description: `Invoice #${invoice.number} has been deleted.`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="w-full">
      <Card className="mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <Tabs defaultValue="all" className="w-auto" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-4 w-full min-w-[320px]">
              <TabsTrigger value="all">All Invoices</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-1 ml-4">
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" aria-label="List view" onClick={() => setViewMode('list')}>
              List View
            </Button>
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" aria-label="Grid view" onClick={() => setViewMode('grid')}>
              Grid View
            </Button>
          </div>
        </div>

        <div>
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 text-left">Invoice #</th>
                    <th className="py-2 px-3 text-left">Client</th>
                    <th className="py-2 px-3 text-left">Status</th>
                    <th className="py-2 px-3 text-left">Amount</th>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-muted/30 transition">
                      <td className="py-2 px-3 font-medium">#{invoice.number}</td>
                      <td className="py-2 px-3">{invoice.client}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(invoice.status)}`}>{invoice.status}</span>
                      </td>
                      <td className="py-2 px-3">${invoice.amount}</td>
                      <td className="py-2 px-3">{format(new Date(invoice.date), 'MMM d, yyyy')}</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1">
                          <Button variant="outline" size="icon" onClick={() => handleViewInvoice(invoice)} aria-label="View">View</Button>
                          <Button variant="outline" size="icon" onClick={() => handleDownloadInvoice(invoice)} aria-label="Download">Download</Button>
                          {(invoice.status === "pending" || invoice.status === "overdue") && (
                            <Button
                              variant="accent"
                              size="icon"
                              onClick={() => onPay(invoice)}
                              className="!px-2"
                              aria-label="Mark as Paid"
                            >
                              Mark Paid
                            </Button>
                          )}
                          <Button variant="outline" size="icon" onClick={() => handleEditInvoice(invoice)} aria-label="Edit">Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        No invoices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <TabsContent value={activeTab} className="p-0">
              <ScrollArea className="h-[calc(100vh-320px)] sm:h-[calc(100vh-280px)]">
                <div className="space-y-4 p-4">
                  {filteredInvoices.map((invoice) => (
                    <InvoiceItem 
                      key={invoice.id} 
                      invoice={invoice}
                      onView={handleViewInvoice}
                      onDownload={handleDownloadInvoice}
                      onSend={handleSendInvoice}
                      onPrint={handlePrintInvoice}
                      onEdit={handleEditInvoice}
                      onDelete={handleDeleteInvoice}
                      getStatusColor={getStatusColor}
                      onPay={onPay}
                    />
                  ))}
                  {filteredInvoices.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No invoices found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </div>
      </Card>
      
      {selectedInvoice && (
        <InvoiceViewDialog
          isOpen={viewInvoiceDialogOpen}
          onClose={() => setViewInvoiceDialogOpen(false)}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}

interface InvoiceItemProps {
  invoice: InvoiceData;
  onView: (invoice: InvoiceData) => void;
  onDownload: (invoice: InvoiceData) => void;
  onSend: (invoice: InvoiceData) => void;
  onPrint: (invoice: InvoiceData) => void;
  onEdit: (invoice: InvoiceData) => void;
  onDelete: (invoice: InvoiceData) => void;
  getStatusColor: (status: string) => string;
  onPay: (invoice: InvoiceData) => void;
}

function InvoiceItem({ invoice, onView, onDownload, onSend, onPrint, onEdit, onDelete, getStatusColor, onPay }: InvoiceItemProps) {
  const showMarkAsPaid = invoice.status === 'pending' || invoice.status === 'overdue';
  return (
    <div className="flex flex-col bg-card rounded-lg shadow">
      <div className="p-4 flex-row justify-between items-center border-b border-border hidden sm:flex">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-medium">Invoice #{invoice.number}</h3>
            <div className="text-sm text-muted-foreground">{invoice.client}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
          <div className="text-sm text-right">
            <div className="font-medium">${invoice.amount}</div>
            <div className="text-muted-foreground flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{format(new Date(invoice.date), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 flex-row justify-between items-center border-b border-border flex sm:hidden">
        <div className="space-y-1">
          <h3 className="font-medium">Invoice #{invoice.number}</h3>
          <div className="text-sm text-muted-foreground">{invoice.client}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
            <div className="text-sm">${invoice.amount}</div>
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(invoice)}
            className="flex items-center"
          >
            View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDownload(invoice)}
            className="hidden sm:flex items-center"
          >
            Download
          </Button>
          {showMarkAsPaid && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => onPay(invoice)}
              className="flex items-center"
            >
              Mark as Paid
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(invoice)}
            className="flex items-center"
          >
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                More
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(invoice)}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSend(invoice)}>Send</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(invoice)}>Download</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint(invoice)}>Print</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(invoice)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(invoice)} className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
