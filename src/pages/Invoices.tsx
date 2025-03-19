
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageTransition } from '@/components/layout/PageTransition';
import { 
  FileTextIcon, 
  SearchIcon, 
  PlusIcon, 
  FilterIcon, 
  ArrowDownIcon, 
  ArrowUpIcon,
  CalendarIcon,
  CheckIcon,
  CreditCardIcon,
  DollarSignIcon,
  DownloadIcon
} from 'lucide-react';

// Mock data for invoices
const invoices = [
  {
    id: 'INV-001',
    client: 'ABC Properties',
    property: '123 Main Street, Anytown',
    date: '2023-05-15',
    dueDate: '2023-05-30',
    amount: 250.00,
    status: 'paid',
    services: ['Photography', 'Floorplans'],
    paymentMethod: 'Credit Card',
  },
  {
    id: 'INV-002',
    client: 'XYZ Realty',
    property: '456 Park Avenue, Somewhere',
    date: '2023-05-16',
    dueDate: '2023-05-31',
    amount: 350.00,
    status: 'paid',
    services: ['Photography', 'Video', '3D Tour'],
    paymentMethod: 'Credit Card',
  },
  {
    id: 'INV-003',
    client: 'John Smith Homes',
    property: '789 Ocean Drive, Beachtown',
    date: '2023-05-17',
    dueDate: '2023-06-01',
    amount: 300.00,
    status: 'pending',
    services: ['Photography', 'Drone'],
    paymentMethod: 'Pending',
  },
  {
    id: 'INV-004',
    client: 'Coastal Properties',
    property: '101 Forest Lane, Woodland',
    date: '2023-05-18',
    dueDate: '2023-06-02',
    amount: 425.00,
    status: 'overdue',
    services: ['Photography', 'Video', 'Virtual Staging'],
    paymentMethod: 'Pending',
  },
  {
    id: 'INV-005',
    client: 'ABC Properties',
    property: '202 Hill Avenue, Heights',
    date: '2023-05-19',
    dueDate: '2023-06-03',
    amount: 275.00,
    status: 'pending',
    services: ['Photography', 'Floorplans'],
    paymentMethod: 'Pending',
  },
];

const InvoicesPage = () => {
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                Invoices
              </Badge>
              <h1 className="text-3xl font-bold">Invoices & Payments</h1>
              <p className="text-muted-foreground">
                Manage all your invoices and track payments
              </p>
            </div>
            
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Invoice
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <h3 className="text-2xl font-bold mt-1">$725.00</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <FileTextIcon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">2 invoices pending</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <h3 className="text-2xl font-bold mt-1">$425.00</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-red-500/10 flex items-center justify-center text-red-500">
                    <FileTextIcon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">1 invoice overdue</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Paid (This Month)</p>
                    <h3 className="text-2xl font-bold mt-1">$600.00</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-green-500/10 flex items-center justify-center text-green-500">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">2 invoices paid</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Total (This Month)</p>
                    <h3 className="text-2xl font-bold mt-1">$1,750.00</h3>
                  </div>
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <DollarSignIcon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">5 total invoices</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Invoice List */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5 text-primary" />
                  Invoice List
                </CardTitle>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search invoices..." 
                      className="pl-9 w-[200px] lg:w-[300px]"
                    />
                  </div>
                  <Button variant="outline" size="icon">
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
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border text-sm text-muted-foreground">
                          <th className="text-left py-3 px-4">Invoice #</th>
                          <th className="text-left py-3 px-4">Client</th>
                          <th className="text-left py-3 px-4">Property</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Due Date</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-center py-3 px-4">Status</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">{invoice.id}</td>
                            <td className="py-3 px-4">{invoice.client}</td>
                            <td className="py-3 px-4 max-w-[180px] truncate">{invoice.property}</td>
                            <td className="py-3 px-4">{invoice.date}</td>
                            <td className="py-3 px-4">{invoice.dueDate}</td>
                            <td className="py-3 px-4 text-right">${invoice.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center">
                                <Badge 
                                  className={
                                    invoice.status === 'paid' 
                                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                      : invoice.status === 'pending'
                                      ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                                  }
                                >
                                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                                {invoice.status !== 'paid' && (
                                  <Button variant="outline" size="sm" className="h-8">
                                    <CreditCardIcon className="h-4 w-4 mr-1" />
                                    Pay
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="pending" className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border text-sm text-muted-foreground">
                          <th className="text-left py-3 px-4">Invoice #</th>
                          <th className="text-left py-3 px-4">Client</th>
                          <th className="text-left py-3 px-4">Property</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Due Date</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-center py-3 px-4">Status</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.filter(invoice => invoice.status === 'pending').map((invoice) => (
                          <tr key={invoice.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">{invoice.id}</td>
                            <td className="py-3 px-4">{invoice.client}</td>
                            <td className="py-3 px-4 max-w-[180px] truncate">{invoice.property}</td>
                            <td className="py-3 px-4">{invoice.date}</td>
                            <td className="py-3 px-4">{invoice.dueDate}</td>
                            <td className="py-3 px-4 text-right">${invoice.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center">
                                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                  Pending
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-8">
                                  <CreditCardIcon className="h-4 w-4 mr-1" />
                                  Pay
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="paid" className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border text-sm text-muted-foreground">
                          <th className="text-left py-3 px-4">Invoice #</th>
                          <th className="text-left py-3 px-4">Client</th>
                          <th className="text-left py-3 px-4">Property</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Due Date</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-center py-3 px-4">Status</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.filter(invoice => invoice.status === 'paid').map((invoice) => (
                          <tr key={invoice.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">{invoice.id}</td>
                            <td className="py-3 px-4">{invoice.client}</td>
                            <td className="py-3 px-4 max-w-[180px] truncate">{invoice.property}</td>
                            <td className="py-3 px-4">{invoice.date}</td>
                            <td className="py-3 px-4">{invoice.dueDate}</td>
                            <td className="py-3 px-4 text-right">${invoice.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center">
                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                  Paid
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="overdue" className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border text-sm text-muted-foreground">
                          <th className="text-left py-3 px-4">Invoice #</th>
                          <th className="text-left py-3 px-4">Client</th>
                          <th className="text-left py-3 px-4">Property</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Due Date</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-center py-3 px-4">Status</th>
                          <th className="text-right py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.filter(invoice => invoice.status === 'overdue').map((invoice) => (
                          <tr key={invoice.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">{invoice.id}</td>
                            <td className="py-3 px-4">{invoice.client}</td>
                            <td className="py-3 px-4 max-w-[180px] truncate">{invoice.property}</td>
                            <td className="py-3 px-4">{invoice.date}</td>
                            <td className="py-3 px-4">{invoice.dueDate}</td>
                            <td className="py-3 px-4 text-right">${invoice.amount.toFixed(2)}</td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center">
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                                  Overdue
                                </Badge>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="h-8">
                                  <CreditCardIcon className="h-4 w-4 mr-1" />
                                  Pay
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default InvoicesPage;
