
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface BookingHeaderProps {
  title: string;
  description: string;
}

export function BookingHeader({ title, description }: BookingHeaderProps) {
  return (
    <div>
      <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
        New Booking
      </Badge>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
