import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Check, MapPin, Calendar, ClipboardCheck } from 'lucide-react';

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function BookingStepIndicator({ currentStep, totalSteps }: BookingStepIndicatorProps) {
  const isMobile = useIsMobile();
  
  // Step icons for visual representation
  const stepIcons = [
    <MapPin key="location" className="h-4 w-4" />,
    <Calendar key="calendar" className="h-4 w-4" />,
    <ClipboardCheck key="review" className="h-4 w-4" />
  ];
  
  // Step labels
  const stepLabels = [
    'Property Details',
    'Schedule',
    'Review'
  ];
  
  return (
    <div className={`flex items-center gap-2 md:gap-4 mb-6 ${isMobile ? "justify-center" : ""}`}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepIndex = index + 1;
        const isCompleted = currentStep > stepIndex;
        const isActive = currentStep === stepIndex;

        // circle classes (theme-aware)
        const circleClasses = isCompleted
          ? // completed
            'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
          : isActive
            ? // active
              'bg-white text-blue-600 dark:bg-slate-800 dark:text-blue-400 ring-4 ring-blue-100 dark:ring-blue-900/30'
            : // inactive
              'bg-gray-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';

        // separator classes
        const separatorClasses = isCompleted
          ? 'bg-blue-500 dark:bg-blue-400'
          : 'bg-gray-200 dark:bg-slate-700';

        return (
          <React.Fragment key={index}>
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: isActive || isCompleted ? 1 : 0.98 }}
              transition={{ duration: 0.18 }}
              className={`relative h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center text-xs md:text-sm transition-colors duration-300 ${circleClasses}`}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${stepLabels[index]} ${isCompleted ? 'completed' : isActive ? 'active' : 'upcoming'}`}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : (
                <div className="flex items-center justify-center">
                  {stepIcons[index]}
                </div>
              )}

              {/* Label (desktop only) */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap hidden md:block">
                <span className={isCompleted ? 'text-slate-700 dark:text-slate-200' : isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}>
                  {stepLabels[index]}
                </span>
              </div>
            </motion.div>

            {index < totalSteps - 1 && (
              <div className={`flex-1 ${isMobile ? 'w-4 md:w-8' : ''}`}>
                {/* Using your Separator component but applying theme-aware classes */}
                <Separator className={`h-0.5 my-0 ${separatorClasses}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
