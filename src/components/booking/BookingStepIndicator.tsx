
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function BookingStepIndicator({ currentStep, totalSteps }: BookingStepIndicatorProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center gap-2 md:gap-4 mb-6 ${isMobile ? "justify-center" : ""}`}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: currentStep >= index + 1 ? 1 : 0.95 }}
            className={`h-7 w-7 md:h-8 md:w-8 rounded-full flex items-center justify-center text-xs md:text-sm transition-colors duration-300 ${
              currentStep > index + 1 
                ? 'bg-primary text-primary-foreground' 
                : currentStep === index + 1
                  ? 'bg-primary text-primary-foreground border-2 border-primary/50'
                  : 'bg-secondary text-muted-foreground'
            }`}
          >
            {currentStep > index + 1 ? (
              <Check className="h-4 w-4" />
            ) : (
              index + 1
            )}
          </motion.div>
          {index < totalSteps - 1 && (
            <Separator 
              className={`flex-1 ${isMobile ? 'w-4 md:w-8' : ''} ${
                currentStep > index + 1 ? 'bg-primary/70' : 'bg-border'
              }`} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
