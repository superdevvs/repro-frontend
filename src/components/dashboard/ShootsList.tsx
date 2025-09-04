
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CalendarIcon, 
  ChevronRightIcon, 
  ImageIcon, 
  MapPinIcon,
  UploadIcon
} from 'lucide-react';
import { ShootData } from '@/types/shoots';
import { parse, format } from 'date-fns';

interface ShootsListProps {
  shoots: ShootData[];
  onSelect: (shoot: ShootData) => void;
  onUploadMedia?: (shoot: ShootData) => void;
  showMedia?: boolean;
}

export function ShootsList({ 
  shoots, 
  onSelect,
  onUploadMedia,
  showMedia = false
}: ShootsListProps) {
  const statusColorMap = {
    'completed': 'bg-green-500',
    'scheduled': 'bg-blue-500',
    'pending': 'bg-amber-500',
    'hold': 'bg-purple-500'
  };

  // Helper function to get media images regardless of format
  const getMediaImages = (media?: ShootData['media']): string[] => {
    if (!media) return [];
    if (media.images && media.images.length > 0) {
      return media.images.map(img => img.url);
    }
    if (media.photos && media.photos.length > 0) {
      return media.photos;
    }
    return [];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[60px]"><Checkbox /></TableHead> */}
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Photographer</TableHead>
            <TableHead>Status</TableHead>
            {showMedia && <TableHead></TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shoots.map((shoot) => {
            const mediaImages = getMediaImages(shoot.media);
            // Only show media for completed shoots, not for hold/pending
            const shouldShowMedia = shoot.status === 'completed' && showMedia;
            
            return (
              <TableRow key={shoot.id} className="cursor-pointer" onClick={() => onSelect(shoot)}>
                {/* <TableCell><Checkbox onClick={(e) => e.stopPropagation()} /></TableCell> */}
                <TableCell>
                  <div className="flex items-center">
                    {/* <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" /> */}
                    {format(new Date(shoot.scheduledDate), 'MMM dd, yyyy')}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {/* <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" /> */}
                    {shoot.time
      ? format(parse(shoot.time, "h:mm a", new Date()), "hh:mm a")
      : "No time"}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {/* <MapPinIcon className="h-4 w-4 mr-2 text-muted-foreground" /> */}
                    {shoot.location.fullAddress}
                  </div>
                </TableCell>
                <TableCell>{shoot.services}</TableCell>
                <TableCell>{shoot.client.name}</TableCell>
                <TableCell>{shoot.photographer.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`${statusColorMap[shoot.status]} text-white`}
                  >
                    {shoot.status.charAt(0).toUpperCase() + shoot.status.slice(1)}
                  </Badge>
                </TableCell>
                {shouldShowMedia && (
                  <TableCell>
                    {mediaImages.length > 0 ? (
                      <div className="flex -space-x-2">
                        {mediaImages.slice(0, 3).map((photo, index) => (
                          <Avatar key={index} className="border-2 border-background w-8 h-8">
                            <AvatarImage src={photo} alt="Media" />
                            <AvatarFallback>
                              <ImageIcon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {mediaImages.length > 3 && (
                          <Avatar className="border-2 border-background bg-muted w-8 h-8">
                            <AvatarFallback>+{mediaImages.length - 3}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No media</span>
                    )}
                  </TableCell>
                )}
                {showMedia && shoot.status !== 'completed' && (
                  <TableCell>
                    <span className="text-muted-foreground text-sm">Not completed</span>
                  </TableCell>
                )}
                <TableCell className="text-right">
                  {shoot.status === 'completed' && showMedia && onUploadMedia ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUploadMedia(shoot);
                      }}
                    >
                      <UploadIcon className="h-4 w-4 mr-2" /> Upload
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
