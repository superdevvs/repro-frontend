
import React from 'react';
import { DollarSign, CalendarIcon, Clock, MapPin, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface BookingSummaryProps {
  summaryInfo: {
    client: string;
    package: string;
    packagePrice: number;
    address: string;
    date: string;
    time: string;
  };
  selectedPackage: string;
  packages: Array<{ id: string; name: string; description: string; price: number }>;
}

export function BookingSummary({ summaryInfo, selectedPackage, packages }: BookingSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card rounded-lg border shadow-sm p-6 sticky top-20"
    >
      <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
      <p className="text-muted-foreground mb-6 text-sm">Complete all steps to schedule your shoot</p>
      
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="text-sm text-muted-foreground">Client</div>
          {summaryInfo.client ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span>{summaryInfo.client}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-2/3" />
          )}
        </div>
        
        <div className="space-y-1.5">
          <div className="text-sm text-muted-foreground">Property</div>
          {summaryInfo.address ? (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <span>{summaryInfo.address}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-full" />
          )}
        </div>
        
        <div className="space-y-1.5">
          <div className="text-sm text-muted-foreground">Date & Time</div>
          {summaryInfo.date ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>{summaryInfo.date}</span>
              </div>
              {summaryInfo.time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{summaryInfo.time}</span>
                </div>
              )}
            </div>
          ) : (
            <Skeleton className="h-6 w-3/4" />
          )}
        </div>
        
        {selectedPackage && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-medium mb-3">Selected Package:</h3>
            <div className="bg-primary/5 rounded-md p-3 border border-primary/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{summaryInfo.package}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {packages.find(p => p.id === selectedPackage)?.description}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span className="font-bold">{summaryInfo.packagePrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
