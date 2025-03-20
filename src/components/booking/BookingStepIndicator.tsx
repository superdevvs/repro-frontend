
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function BookingStepIndicator({ currentStep, totalSteps }: BookingStepIndicatorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center gap-2 md:gap-4 mb-4 ${isMobile ? "justify-center" : ""}`}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div 
            className={`h-6 w-6 md:h-8 md:w-8 rounded-full flex items-center justify-center text-xs md:text-sm ${
              currentStep >= index + 1 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <Separator className={`flex-1 ${isMobile ? 'w-4 md:w-auto' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
