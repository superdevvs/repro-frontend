
import React from 'react';
import { DollarSign, AlertCircle, CheckCircle, ChevronUp, ChevronDown, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceData } from '@/utils/invoiceUtils';
import { cn } from '@/lib/utils';

interface OverviewCardsProps {
  invoices: InvoiceData[];
  timeFilter: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export function OverviewCards({ invoices, timeFilter }: OverviewCardsProps) {
  // Calculate totals based on invoice status
  const totalRevenue = invoices
    .filter(invoice => invoice.status?.toLowerCase?.() === 'paid')
    .reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const pendingInvoices = invoices.filter(invoice => invoice.status?.toLowerCase?.() === 'pending');
  const pendingTotal = pendingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const overdueInvoices = invoices.filter(invoice => invoice.status?.toLowerCase?.() === 'overdue');
  const overdueTotal = overdueInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  
  const paidInvoices = invoices.filter(invoice => invoice.status?.toLowerCase?.() === 'paid');
  const paidTotal = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  // Fake trend data for demonstration
  const trends = {
    revenue: { value: 8.2, direction: 'up' as const },
    pending: { value: -2.5, direction: 'down' as const },
    overdue: { value: 4.1, direction: 'up' as const },
    paid: { value: 12.5, direction: 'up' as const }
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <OverviewCard
        title="Total Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        description={`Current ${timeFilter}`}
        icon={<DollarSign className="h-4 w-4" />}
        trend={trends.revenue}
        color="blue"
        animated={true}
      />
      
      <OverviewCard
        title="Outstanding Invoices"
        value={`$${pendingTotal.toLocaleString()}`}
        description={`${pendingInvoices.length} invoice${pendingInvoices.length !== 1 ? 's' : ''}`}
        icon={<CreditCard className="h-4 w-4" />}
        trend={trends.pending}
        color="amber"
        animated={true}
      />
      
      <OverviewCard
        title="Overdue Payments"
        value={`$${overdueTotal.toLocaleString()}`}
        description={`${overdueInvoices.length} invoice${overdueInvoices.length !== 1 ? 's' : ''}`}
        icon={<AlertCircle className="h-4 w-4" />}
        trend={trends.overdue}
        color="rose"
        animated={true}
      />
      
      <OverviewCard
        title="Paid (This Month)"
        value={`$${paidTotal.toLocaleString()}`}
        description={`${paidInvoices.length} invoice${paidInvoices.length !== 1 ? 's' : ''}`}
        icon={<CheckCircle className="h-4 w-4" />}
        trend={trends.paid}
        color="emerald"
        animated={true}
      />
    </div>
  );
}

interface OverviewCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'blue' | 'emerald' | 'amber' | 'rose';
  animated?: boolean;
}

function OverviewCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  color = 'blue',
  animated = false 
}: OverviewCardProps) {
  const colorStyles = {
    blue: {
      iconBg: 'bg-blue-500/10',
      iconText: 'text-blue-500',
      trendUp: 'text-blue-600',
      trendDown: 'text-blue-600 opacity-80',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10',
      iconText: 'text-emerald-500',
      trendUp: 'text-emerald-600',
      trendDown: 'text-emerald-600 opacity-80',
    },
    amber: {
      iconBg: 'bg-amber-500/10',
      iconText: 'text-amber-500',
      trendUp: 'text-amber-600',
      trendDown: 'text-amber-600 opacity-80',
    },
    rose: {
      iconBg: 'bg-rose-500/10',
      iconText: 'text-rose-500',
      trendUp: 'text-rose-600',
      trendDown: 'text-rose-600 opacity-80',
    },
  };
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all border",
      animated && "hover:shadow-md hover:-translate-y-0.5"
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
              {trend && (
                <div className={cn(
                  "flex items-center text-xs font-medium",
                  trend.direction === 'up' 
                    ? colorStyles[color].trendUp
                    : colorStyles[color].trendDown
                )}>
                  {trend.direction === 'up' ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
          </div>
          <div className={cn(
            "h-8 w-8 rounded-md flex items-center justify-center",
            colorStyles[color].iconBg,
            colorStyles[color].iconText
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
