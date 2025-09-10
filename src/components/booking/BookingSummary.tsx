
import React from 'react';
import { DollarSign, CalendarIcon, Clock, MapPin, User, CloudSun, Check } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BookingSummaryProps {
  summaryInfo: {
    client: string;
    package: string;
    packagePrice: number;
    address: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    date: string;
    time: string;
  };
  selectedPackage: string;
  packages: Array<{ id: string; name: string; description: string; price: number }>;
  onSubmit?: () => void;
  isLastStep?: boolean;
}

export function BookingSummary({ 
  summaryInfo, 
  selectedPackage, 
  packages, 
  onSubmit, 
  isLastStep = false 
}: BookingSummaryProps) {
  const selectedPackageDetails = packages.find(p => p.id === selectedPackage);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-[#0e1525] to-[#182135] rounded-lg border border-[#1e2d4a] shadow-lg p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto"
    >
      <h2 className="text-xl font-bold mb-2 text-white">Booking Summary</h2>
      <p className="text-muted-foreground mb-6 text-sm">Complete all steps to schedule your shoot</p>
      
      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="text-sm text-blue-400">Client</div>
          {summaryInfo.client ? (
            <div className="flex items-center gap-2 text-white">
              <User className="h-4 w-4 text-blue-500" />
              <span>{summaryInfo.client}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-2/3 bg-[#1e2d4a]" />
          )}
        </div>
        
        <div className="space-y-1.5">
          <div className="text-sm text-blue-400">Property</div>
          {summaryInfo.address ? (
            <div className="flex items-start gap-2 text-white">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
              <span>{summaryInfo.address}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-full bg-[#1e2d4a]" />
          )}
        </div>

        {/* <div className="space-y-1.5">
          <div className="text-sm text-blue-400">Area</div>
          {summaryInfo.sqft ? (
            <div className="flex items-start gap-2 text-white">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
              <span>{summaryInfo.sqft}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-full bg-[#1e2d4a]" />
          )}
        </div> */}
        
        <div className="space-y-1.5">
          <div className="text-sm text-blue-400">Date & Time</div>
          {summaryInfo.date ? (
            <div className="flex flex-col gap-1 text-white">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-blue-500" />
                <span>{summaryInfo.date}</span>
              </div>
              {summaryInfo.time && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>{summaryInfo.time}</span>
                </div>
              )}
            </div>
          ) : (
            <Skeleton className="h-6 w-3/4 bg-[#1e2d4a]" />
          )}
        </div>
        
        {(summaryInfo.date && summaryInfo.address) && (
          <div className="pt-2">
            <div className="flex items-center gap-2 text-white">
              <CloudSun className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Weather forecast available</span>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 ml-1">
                Premium
              </Badge>
            </div>
          </div>
        )}
        
        {selectedPackage && (
          <div className="pt-4 border-t border-[#1e2d4a]">
            <h3 className="text-sm font-medium mb-3 text-blue-400">Selected Package:</h3>
            <div className="bg-[#131f35] rounded-md p-3 border border-[#243351]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-white">{summaryInfo.package}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedPackageDetails?.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-bold">{summaryInfo.packagePrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-[#1e2d4a]">
          <Button 
            onClick={onSubmit} 
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
          >
            <Check className="mr-2 h-4 w-4" /> Book Shoot
          </Button>
        </div>
      </div>
    </motion.div>
  );
}