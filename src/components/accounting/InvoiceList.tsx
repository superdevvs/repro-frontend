
import React from 'react';
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
import { InvoiceViewDialog } from '@/components/invoices/InvoiceViewDialog';

export function InvoiceList({ data }) {
  const { toast } = useToast();
  const [viewInvoiceDialogOpen, setViewInvoiceDialogOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewInvoiceDialogOpen(true);
  };

  const handleDownloadInvoice = (invoice) => {
    toast({
      title: "Invoice downloaded",
      description: `Invoice #${invoice.number} has been downloaded.`
    });
  };

  const handleSendInvoice = (invoice) => {
    toast({
      title: "Invoice sent",
      description: `Invoice #${invoice.number} has been sent to ${invoice.client}.`
    });
  };

  const handlePrintInvoice = (invoice) => {
    toast({
      title: "Printing invoice",
      description: `Invoice #${invoice.number} sent to printer.`
    });
  };

  const handleEditInvoice = (invoice) => {
    toast({
      title: "Edit invoice",
      description: `Edit mode for invoice #${invoice.number}.`
    });
  };

  const handleDeleteInvoice = (invoice) => {
    toast({
      title: "Invoice deleted",
      description: `Invoice #${invoice.number} has been deleted.`,
      variant: "destructive"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="w-full">
      <ScrollArea className="h-[calc(100vh-320px)] sm:h-[calc(100vh-280px)]">
        <div className="space-y-4">
          {data.invoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-col bg-card rounded-lg shadow">
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
                    onClick={() => handleViewInvoice(invoice)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" /> View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDownloadInvoice(invoice)}
                    className="hidden sm:flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" /> Download
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleSendInvoice(invoice)}
                    className="hidden sm:flex items-center gap-1"
                  >
                    <Send className="h-4 w-4" /> Send
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
                      <DropdownMenuItem onClick={() => handleViewInvoice(invoice)} className="flex items-center gap-2">
                        <Eye className="h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendInvoice(invoice)} className="flex items-center gap-2">
                        <Send className="h-4 w-4" /> Send
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadInvoice(invoice)} className="flex items-center gap-2">
                        <Download className="h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrintInvoice(invoice)} className="flex items-center gap-2">
                        <Printer className="h-4 w-4" /> Print
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEditInvoice(invoice)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteInvoice(invoice)} className="text-red-500 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {selectedInvoice && (
        <InvoiceViewDialog
          open={viewInvoiceDialogOpen}
          onOpenChange={setViewInvoiceDialogOpen}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
}
