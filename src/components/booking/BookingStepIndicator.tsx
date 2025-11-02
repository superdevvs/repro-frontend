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
  
  // Step icons for better visual representation
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
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: currentStep >= index + 1 ? 1 : 0.95 }}
            className={`relative h-10 w-10 md:h-12 md:w-12 rounded-full flex flex-col items-center justify-center text-xs md:text-sm transition-colors duration-300 ${
              currentStep > index + 1 
                ? 'bg-primary text-primary-foreground' 
                : currentStep === index + 1
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-secondary text-muted-foreground'
            }`}
          >
            {currentStep > index + 1 ? (
              <Check className="h-5 w-5" />
            ) : (
              <React.Fragment>
                {stepIcons[index]}
                {/* <span className="sr-only md:not-sr-only md:text-[10px] md:mt-0.5 whitespace-nowrap">
                  {stepLabels[index]}
                </span> */}
              </React.Fragment>
            )}
            
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap hidden md:block">
              {stepLabels[index]}
            </div>
          </motion.div>
          
          {index < totalSteps - 1 && (
            <Separator 
              className={`flex-1 ${isMobile ? 'w-4 md:w-8' : ''} ${
                currentStep > index + 1 ? 'bg-primary/70' : 'bg-border'
              } transition-colors duration-300`} 
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
