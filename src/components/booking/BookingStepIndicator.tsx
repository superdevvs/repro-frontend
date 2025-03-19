
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function BookingStepIndicator({ currentStep, totalSteps }: BookingStepIndicatorProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div 
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              currentStep >= index + 1 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-muted-foreground'
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <Separator className="flex-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
