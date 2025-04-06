
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileTextIcon, 
  SearchIcon, 
  FilterIcon, 
  CheckIcon,
  CreditCardIcon,
  DownloadIcon,
  EyeIcon,
  SendIcon
} from 'lucide-react';
import { InvoiceData } from '@/utils/invoiceUtils';
import { cn } from '@/lib/utils';

interface InvoiceListProps {
  invoices: InvoiceData[];
  onView: (invoice: InvoiceData) => void;
  onDownload: (invoice: InvoiceData) => void;
  onPay: (invoice: InvoiceData) => void;
  onSendReminder: (invoice: InvoiceData) => void;
}

export function InvoiceList({ 
  invoices, 
  onView, 
  onDownload, 
  onPay,
  onSendReminder
}: InvoiceListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = searchQuery
    ? invoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.property.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : invoices;

  return (
    <Card className="overflow-hidden border">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-primary" />
            Invoices & Payments
          </CardTitle>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search invoices..." 
                className="pl-9 w-full sm:w-[280px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-muted/50 mb-4">
            <TabsTrigger value="all" className="data-[state=active]:bg-background">All</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-background">Pending</TabsTrigger>
            <TabsTrigger value="paid" className="data-[state=active]:bg-background">Paid</TabsTrigger>
            <TabsTrigger value="overdue" className="data-[state=active]:bg-background">Overdue</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <InvoiceTable 
              invoices={filteredInvoices} 
              onView={onView}
              onDownload={onDownload}
              onPay={onPay}
              onSendReminder={onSendReminder}
            />
          </TabsContent>
          
          <TabsContent value="pending" className="mt-0">
            <InvoiceTable 
              invoices={filteredInvoices.filter(invoice => invoice.status === 'pending')} 
              onView={onView}
              onDownload={onDownload}
              onPay={onPay}
              onSendReminder={onSendReminder}
            />
          </TabsContent>
          
          <TabsContent value="paid" className="mt-0">
            <InvoiceTable 
              invoices={filteredInvoices.filter(invoice => invoice.status === 'paid')} 
              onView={onView}
              onDownload={onDownload}
              onPay={onPay}
              onSendReminder={onSendReminder}
            />
          </TabsContent>
          
          <TabsContent value="overdue" className="mt-0">
            <InvoiceTable 
              invoices={filteredInvoices.filter(invoice => invoice.status === 'overdue')} 
              onView={onView}
              onDownload={onDownload}
              onPay={onPay}
              onSendReminder={onSendReminder}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface InvoiceTableProps {
  invoices: InvoiceData[];
  onView: (invoice: InvoiceData) => void;
  onDownload: (invoice: InvoiceData) => void;
  onPay: (invoice: InvoiceData) => void;
  onSendReminder: (invoice: InvoiceData) => void;
}

function InvoiceTable({ 
  invoices,
  onView,
  onDownload,
  onPay,
  onSendReminder
}: InvoiceTableProps) {
  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'paid':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'overdue':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Property</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead className="hidden lg:table-cell">Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow key={invoice.id} className="group">
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.client}</TableCell>
                <TableCell className="max-w-[180px] truncate hidden md:table-cell">
                  {invoice.property}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{invoice.date}</TableCell>
                <TableCell className="hidden lg:table-cell">{invoice.dueDate}</TableCell>
                <TableCell className="text-right font-medium">
                  ${invoice.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <Badge className={cn(getStatusStyles(invoice.status))}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onView(invoice)}
                      title="View Invoice"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onDownload(invoice)}
                      title="Download Invoice"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                    {invoice.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onSendReminder(invoice)}
                        title="Send Reminder"
                      >
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    )}
                    {invoice.status !== 'paid' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 hidden sm:flex ml-1"
                        onClick={() => onPay(invoice)}
                      >
                        <CreditCardIcon className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No invoices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
