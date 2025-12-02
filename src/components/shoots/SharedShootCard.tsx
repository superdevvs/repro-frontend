import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Cloud,
  MoreHorizontal,
  ChevronRight,
  Layers,
  User,
  Camera,
  Sun,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { ShootAction, ShootData } from '@/types/shoots';
import type { Role } from '@/components/auth/AuthProvider';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SharedShootCardProps {
  shoot: ShootData;
  role: Role;
  onSelect?: (shoot: ShootData) => void;
  onPrimaryAction?: (action: ShootAction, shoot: ShootData) => void;
  onOpenWorkflow?: (shoot: ShootData) => void;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  booked: 'bg-slate-100 text-slate-700 border-slate-200',
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  on_hold: 'bg-amber-100 text-amber-700 border-amber-200',
  raw_uploaded: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  editing: 'bg-purple-100 text-purple-700 border-purple-200',
};

const roleDefaultActions: Record<Role, ShootAction> = {
  client: { label: 'View Media', action: 'view_media' },
  photographer: { label: 'Upload RAW', action: 'upload_raw' },
  editor: { label: 'Start Editing', action: 'upload_final' },
  admin: { label: 'Open Workflow', action: 'open_workflow' },
  superadmin: { label: 'Open Workflow', action: 'open_workflow' },
  salesRep: { label: 'View Details', action: 'open_workflow' },
};

export const SharedShootCard: React.FC<SharedShootCardProps> = ({
  shoot,
  role,
  onSelect,
  onPrimaryAction,
  onOpenWorkflow,
}) => {
  const heroImage = shoot.heroImage || '/placeholder.svg';
  const statusClass =
    statusColors[shoot.workflowStatus || shoot.status] ?? 'bg-slate-100 text-slate-700 border-slate-200';
  const primaryAction = shoot.primaryAction || roleDefaultActions[role];
  const isSuperAdmin = role === 'superadmin';
  const isClient = role === 'client';

  const handlePrimary = () => {
    const action = shoot.primaryAction || roleDefaultActions[role];
    if (action.action === 'open_workflow' && onOpenWorkflow) {
      onOpenWorkflow(shoot);
      return;
    }
    onPrimaryAction?.(action, shoot);
  };

  const handlePayNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payAction: ShootAction = { label: 'Pay now', action: 'pay' };
    onPrimaryAction?.(payAction, shoot);
  };

  const bracketMode = shoot.package?.bracketMode || null;
  const bracketSummary =
    bracketMode && shoot.package?.expectedDeliveredCount
      ? `${bracketMode}-bracket · ${shoot.package.expectedDeliveredCount * bracketMode} RAW expected`
      : null;

  // Determine if payment is complete - Only Super Admin can see payment status
  // Clients can see if their own shoot is paid/unpaid for payment button visibility
  const isPaid = isSuperAdmin || isClient 
    ? (shoot.payment.totalPaid >= shoot.payment.totalQuote)
    : false; // Hide payment status from Admin, Editor, Photographer

  // Format the date
  const formattedDate = shoot.scheduledDate 
    ? format(new Date(shoot.scheduledDate), 'MMM dd, yyyy')
    : 'Not scheduled';

  return (
    <Card
      className="overflow-hidden border border-border/70 hover:border-primary/70 transition-shadow hover:shadow-lg cursor-pointer bg-gradient-to-b from-background via-background to-muted/20"
      onClick={() => onSelect?.(shoot)}
    >
      {/* Hero Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img src={heroImage} alt={shoot.location.address} className="h-full w-full object-cover" loading="lazy" />
        
        {/* Status Badge - Left */}
        <div className="absolute top-4 left-4">
          <Badge 
            className={cn('capitalize text-base font-medium px-6 py-2 rounded-full shadow-lg', statusClass)}
          >
            {shoot.workflowStatus || shoot.status}
          </Badge>
        </div>

        {/* Weather & Pay Button - Right */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {shoot.weather?.temperature && (
            <div className="flex items-center gap-1.5 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md">
              <Sun className="h-4 w-4 text-orange-500" />
              <span className="font-semibold text-sm">{shoot.weather.temperature}</span>
            </div>
          )}
          
          {/* Pay Now Button - Only show to clients for their own shoots if not paid */}
          {isClient && !isPaid && (
            <Button 
              onClick={handlePayNow}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg"
              size="sm"
            >
              Pay now
            </Button>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Address */}
        <div>
          <h3 className="text-2xl font-bold leading-tight mb-1">{shoot.location.address}</h3>
          <p className="text-base text-muted-foreground">
            {shoot.location.city}, {shoot.location.state} {shoot.location.zip}
          </p>
        </div>

        {/* Client, Photographer, Date Grid */}
        <div className="grid grid-cols-3 gap-4 py-2">
          {/* Client */}
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium truncate">{shoot.client.name}</span>
          </div>
          
          {/* Photographer */}
          {shoot.photographer?.name && (
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium truncate">{shoot.photographer.name}</span>
            </div>
          )}
          
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium truncate">{formattedDate}</span>
          </div>
        </div>

        {/* Service Tags */}
        {shoot.services?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {shoot.services.map((service, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-muted/60 text-foreground font-normal px-4 py-1.5 text-sm rounded-full"
              >
                {service}
              </Badge>
            ))}
          </div>
        )}

        {/* Additional Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {bracketSummary && (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
              <Layers className="h-3.5 w-3.5" />
              {bracketSummary}
            </Badge>
          )}
          {shoot.missingRaw && (
            <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">
              Missing RAW · {shoot.rawMissingCount}
            </Badge>
          )}
          {shoot.missingFinal && (
            <Badge variant="destructive" className="rounded-full px-3 py-1 text-xs">
              Missing Finals · {shoot.editedMissingCount}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
};

export default SharedShootCard;

