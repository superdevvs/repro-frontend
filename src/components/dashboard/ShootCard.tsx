
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarIcon, ClockIcon, CameraIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShootCardProps {
  id: string;
  address: string;
  date: string;
  time: string;
  photographer: {
    name: string;
    avatar?: string;
  };
  client: {
    name: string;
  };
  status: 'scheduled' | 'completed' | 'pending' | 'cancelled';
  price?: number;
  delay?: number;
  onClick?: () => void;
}

export function ShootCard({
  id,
  address,
  date,
  time,
  photographer,
  client,
  status,
  price,
  delay = 0,
  onClick,
}: ShootCardProps) {
  const isMobile = useIsMobile();
  
  const statusColors = {
    scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const statusText = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    pending: 'Pending',
    cancelled: 'Cancelled',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ y: -2 }}
    >
      <Card className="glass-card h-full overflow-hidden cursor-pointer" onClick={onClick}>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <Badge className={cn("font-normal", statusColors[status])}>
                {statusText[status]}
              </Badge>
              <span className={`text-sm text-muted-foreground ${isMobile ? 'hidden' : 'block'}`}>#{id}</span>
            </div>
            
            <h3 className="font-medium text-base md:text-lg mb-2 truncate">{address}</h3>
            
            <div className={`space-y-2 text-xs md:text-sm ${isMobile ? 'grid grid-cols-2 gap-2' : ''}`}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ClockIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{time}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CameraIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{photographer.name}</span>
              </div>
              <div className={`flex items-center gap-2 text-muted-foreground ${isMobile ? 'col-span-2' : ''}`}>
                <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{address}</span>
              </div>
              {price && (
                <div className={`flex items-center gap-2 text-muted-foreground ${isMobile ? 'col-span-2' : ''}`}>
                  <DollarSignIcon className="h-4 w-4 flex-shrink-0" />
                  <span>${price.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex items-center justify-between p-3 md:p-4 bg-secondary/30 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 md:h-8 md:w-8">
              <AvatarImage src={photographer.avatar} />
              <AvatarFallback>{photographer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-medium">Client</p>
              <p className="text-xs text-muted-foreground truncate max-w-24 md:max-w-32">{client.name}</p>
            </div>
          </div>
          
          <Button size="sm" variant="outline" className="text-xs h-7 px-2 md:h-8 md:px-3">
            Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
