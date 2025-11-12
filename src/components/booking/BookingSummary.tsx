import React from 'react';
import { DollarSign, Calendar as CalendarIcon, Clock, MapPin, User, CloudSun, Check } from 'lucide-react';
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
      className={
        // light by default, dark when `dark:` is present in page
        "bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm p-6 sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto"
      }
    >
      <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Booking Summary</h2>
      <p className="text-sm mb-6 text-slate-500 dark:text-slate-300">Complete all steps to schedule your shoot</p>

      <div className="space-y-6">
        <div className="space-y-1.5">
          <div className="text-sm text-blue-600 dark:text-blue-400">Client</div>
          {summaryInfo.client ? (
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <User className="h-4 w-4 text-blue-500" />
              <span>{summaryInfo.client}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-2/3" />
          )}
        </div>

        <div className="space-y-1.5">
          <div className="text-sm text-blue-600 dark:text-blue-400">Property</div>
          {summaryInfo.address ? (
            <div className="flex items-start gap-2 text-slate-900 dark:text-white">
              <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
              <span>{summaryInfo.address}</span>
            </div>
          ) : (
            <Skeleton className="h-6 w-full" />
          )}
        </div>

        <div className="space-y-1.5">
          <div className="text-sm text-blue-600 dark:text-blue-400">Date & Time</div>
          {summaryInfo.date ? (
            <div className="flex flex-col gap-1 text-slate-900 dark:text-white">
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
            <Skeleton className="h-6 w-3/4" />
          )}
        </div>

        {selectedPackage && (
          <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
            <h3 className="text-sm font-medium mb-3 text-blue-600 dark:text-blue-400">Selected Package:</h3>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-md p-3 border border-gray-100 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{summaryInfo.package}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {selectedPackageDetails?.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-bold">{summaryInfo.packagePrice}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
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
