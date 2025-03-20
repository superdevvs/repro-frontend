
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface BookingHeaderProps {
  title: string;
  description: string;
}

export function BookingHeader({ title, description }: BookingHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? "text-center" : ""}>
      <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
        New Booking
      </Badge>
      <h1 className={`text-2xl md:text-3xl font-bold ${isMobile ? "mt-2" : ""}`}>{title}</h1>
      <p className="text-muted-foreground max-w-lg mt-1">
        {description}
      </p>
    </div>
  );
}
