
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  delay?: number;
  className?: string;
  isCompact?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend = 'neutral',
  trendValue,
  delay = 0,
  className,
  isCompact = false
}) => {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };
  
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-3 w-3" />;
      case 'down':
        return <ArrowDownRight className="h-3 w-3" />;
      default:
        return null;
    }
  };
  
  const containerClass = isCompact
    ? "p-2"
    : "p-4 md:p-6";

  const titleClass = isCompact
    ? "text-sm font-medium text-muted-foreground mb-0.5"
    : "text-sm font-medium text-muted-foreground mb-1";

  const valueClass = isCompact
    ? "text-lg font-bold mb-0"
    : "text-2xl font-bold mb-1";

  const iconContainerClass = isCompact
    ? "p-1.5 rounded-full"
    : "p-2 rounded-full";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.3 }}
      className={className}
    >
      <Card className={cn("border shadow-sm hover:shadow-md transition-shadow", isCompact && "compact-card")}>
        <CardContent className={cn("p-4", containerClass)}>
          <div className="flex justify-between items-start">
            <div>
              <p className={titleClass}>{title}</p>
              <h3 className={valueClass}>{value}</h3>
              
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">{description}</p>
                
                {trendValue && (
                  <div className={cn("flex items-center text-xs gap-0.5 ml-2", getTrendColor(trend))}>
                    {getTrendIcon(trend)}
                    <span className="font-medium">{trendValue}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className={cn("bg-primary/10 text-primary", iconContainerClass)}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
