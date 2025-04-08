
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface BookingHeaderProps {
  title: string;
  description: string;
}

export function BookingHeader({ title, description }: BookingHeaderProps) {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isMobile ? "text-center" : ""} mb-6`}
    >
      <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
        New Booking
      </Badge>
      <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${isMobile ? "mt-2" : ""}`}>{title}</h1>
      <p className="text-muted-foreground max-w-xl mt-2">
        {description}
      </p>
    </motion.div>
  );
}
