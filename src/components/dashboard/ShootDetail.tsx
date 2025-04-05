
import React from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShootData } from '@/types/shoots';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin,
  CalendarIcon,
  Clock,
  User,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock3
} from 'lucide-react';

interface ShootDetailProps {
  shoot: ShootData;
  isOpen: boolean;
  onClose: () => void;
}

export const ShootDetail = ({ shoot, isOpen, onClose }: ShootDetailProps) => {
  // Format the shoot date
  const formattedDate = shoot.scheduledDate 
    ? format(new Date(shoot.scheduledDate), 'MMMM d, yyyy')
    : 'Not scheduled';

  // Get status badge color
  const getStatusColor = () => {
    switch (shoot.status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'hold':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (shoot.status) {
      case 'scheduled':
        return <CalendarIcon className="h-4 w-4" />;
      case 'pending':
        return <Clock3 className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'hold':
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Shoot Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className={getStatusColor()}>
              <span className="flex items-center">
                {getStatusIcon()}
                <span className="ml-1 capitalize">{shoot.status}</span>
              </span>
            </Badge>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`/shoots/${shoot.id}`, '_blank')}
            >
              View Full Details
            </Button>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
            </div>

            {shoot.time && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{shoot.time}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{shoot.location.fullAddress || 'No address provided'}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{shoot.client.name || 'No client name'}</span>
            </div>

            {shoot.photographer && shoot.photographer.name && (
              <div className="flex items-center gap-2 text-sm">
                <Camera className="h-4 w-4 text-muted-foreground" />
                <span>{shoot.photographer.name}</span>
              </div>
            )}
          </div>

          {shoot.notes && shoot.notes.shootNotes && (
            <div className="mt-4 bg-muted/50 p-3 rounded-md">
              <h3 className="text-sm font-medium mb-1">Notes:</h3>
              <p className="text-sm">{shoot.notes.shootNotes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
