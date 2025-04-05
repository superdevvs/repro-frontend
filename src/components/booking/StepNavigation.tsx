
import React from 'react';
import { Button } from '@/components/ui/button';

interface StepNavigationProps {
  step: number;
  goBack: () => void;
  goNext: () => void;
  nextLabel?: string;
}

export function StepNavigation({ step, goBack, goNext, nextLabel = 'Continue' }: StepNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={goBack}
        disabled={step === 1}
      >
        Back
      </Button>
      
      <Button
        onClick={goNext}
        className="bg-primary hover:bg-primary/90 transition-colors"
      >
        {step === 3 ? 'Confirm Booking' : nextLabel}
      </Button>
    </div>
  );
}
