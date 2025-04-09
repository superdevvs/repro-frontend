
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Download, 
  Eye, 
  MoreHorizontal, 
  Printer, 
  Send, 
  Edit, 
  Trash2 
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
        <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
          <div className="p-4 border-b">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="all">All Invoices</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0">
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
          
          <TabsContent value="pending" className="p-0">
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
                  />
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No pending invoices found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="paid" className="p-0">
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
                  />
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No paid invoices found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="overdue" className="p-0">
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
                  />
                ))}
                {filteredInvoices.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">No overdue invoices found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
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
}

function InvoiceItem({ invoice, onView, onDownload, onSend, onPrint, onEdit, onDelete, getStatusColor }: InvoiceItemProps) {
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

      {/* Mobile view */}
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
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" /> View
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDownload(invoice)}
            className="hidden sm:flex items-center gap-1"
          >
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(invoice)}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(invoice)} className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSend(invoice)} className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Send
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(invoice)} className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrint(invoice)} className="flex items-center gap-2">
                <Printer className="h-4 w-4" /> Print
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(invoice)} className="flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(invoice)} className="text-red-500 flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
