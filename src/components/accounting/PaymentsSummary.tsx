
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { InvoiceData } from '@/utils/invoiceUtils';
import { ArrowUpRight, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentsSummaryProps {
  invoices: InvoiceData[];
}

export function PaymentsSummary({ invoices }: PaymentsSummaryProps) {
  // Calculate payment statistics
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = invoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const paymentPercentage = totalInvoiced > 0 
    ? Math.round((totalPaid / totalInvoiced) * 100) 
    : 0;
  
  // Calculate upcoming and overdue amounts
  const totalPending = invoices
    .filter(invoice => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const totalOverdue = invoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  // Extract payment methods from paid invoices (in a real app, this would be more robust)
  const paymentMethods = invoices
    .filter(invoice => invoice.status === 'paid' && invoice.paymentMethod)
    .reduce((methods, invoice) => {
      const method = invoice.paymentMethod || 'Unknown';
      methods[method] = (methods[method] || 0) + invoice.amount;
      return methods;
    }, {} as Record<string, number>);
  
  // Convert to array and sort by amount
  const paymentMethodsArray = Object.entries(paymentMethods)
    .map(([method, amount]) => ({ method, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4); // Top 4 methods
  
  const getTrendColor = (percentage: number) => {
    if (percentage >= 70) return "text-emerald-500";
    if (percentage >= 40) return "text-amber-500";
    return "text-rose-500";
  };
  
  return (
    <Card className="overflow-hidden border h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payments Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm font-medium">Payment Rate</p>
                <p className="text-xs text-muted-foreground">
                  {paymentPercentage}% of invoices paid
                </p>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium",
                getTrendColor(paymentPercentage)
              )}>
                {paymentPercentage}%
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
            <Progress value={paymentPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Pending</h4>
              <p className="text-xl font-semibold">${totalPending.toLocaleString()}</p>
            </div>
            
            <div className="p-3 rounded-md bg-rose-500/10 border border-rose-500/20">
              <h4 className="text-xs font-medium text-muted-foreground mb-1">Overdue</h4>
              <p className="text-xl font-semibold">${totalOverdue.toLocaleString()}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3">Payment Methods</h4>
            <div className="space-y-3">
              {paymentMethodsArray.length > 0 ? (
                paymentMethodsArray.map(({ method, amount }) => (
                  <div key={method} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <p className="text-sm">{method}</p>
                    </div>
                    <p className="text-sm font-medium">${amount.toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No payment data available</p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Latest Transactions</h4>
            <div className="space-y-2">
              {invoices
                .filter(invoice => invoice.status === 'paid')
                .slice(0, 3)
                .map(invoice => (
                  <div key={invoice.id} className="flex justify-between items-center p-2 rounded-md bg-muted/50">
                    <div>
                      <p className="text-sm font-medium">{invoice.client}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                    <p className="text-sm font-medium">${invoice.amount.toLocaleString()}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
