
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, getDaysSince } from '@/utils/dateUtils';
import { ensureNotesObject } from '@/types/shoots';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Camera, 
  DollarSign, 
  Check, 
  X, 
  AlertCircle,
  ExternalLink,
  Mail,
  Phone
} from 'lucide-react';
import { ShootData, Client as ClientType, Photographer as PhotographerType } from '@/types/shoots';
import { ShootMediaTab } from './ShootMediaTab';
import { ShootNotesTab } from './ShootNotesTab';
import { useAuth } from '@/components/auth/AuthProvider';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ShootDetailProps {
  shoot: ShootData;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function ShootDetail({ shoot, onClose, isOpen }: ShootDetailProps) {
  const { user, role } = useAuth();
  
  const isAdmin = role === 'admin' || role === 'superadmin';
  const isPhotographer = role === 'photographer';
  const isClient = role === 'client';
  
  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500',
    completed: 'bg-green-500',
    'in-progress': 'bg-orange-500',
    cancelled: 'bg-red-500',
    pending: 'bg-yellow-500',
    hold: 'bg-purple-500',
    booked: 'bg-teal-500'
  };
  
  const statusIcons: Record<string, JSX.Element> = {
    scheduled: <Calendar className="h-4 w-4" />,
    completed: <Check className="h-4 w-4" />,
    'in-progress': <Clock className="h-4 w-4" />,
    cancelled: <X className="h-4 w-4" />,
    pending: <AlertCircle className="h-4 w-4" />,
    hold: <AlertCircle className="h-4 w-4" />,
    booked: <Check className="h-4 w-4" />
  };
  
  const formattedDate = formatDate(shoot.scheduledDate);
  const daysSinceScheduled = getDaysSince(shoot.scheduledDate);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold">{shoot.client.name}</h2>
            <Badge className={`${statusColors[shoot.status]} text-white`}>
              <span className="flex items-center gap-1">
                {statusIcons[shoot.status]}
                {shoot.status.charAt(0).toUpperCase() + shoot.status.slice(1)}
              </span>
            </Badge>
          </div>
          <div className="text-muted-foreground">
            {formattedDate} {shoot.time && `at ${shoot.time}`}
            <span className="mx-1">•</span>
            {daysSinceScheduled === 0 ? 'Today' : 
             daysSinceScheduled > 0 ? `${daysSinceScheduled} days ago` : 
             `In ${Math.abs(daysSinceScheduled)} days`}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            <MapPin className="inline mr-1 h-4 w-4" />
            {shoot.location.fullAddress || `${shoot.location.address}, ${shoot.location.city}, ${shoot.location.state} ${shoot.location.zipCode || shoot.location.zip}`}
          </div>
        </div>
        
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="details" className="flex flex-col flex-grow">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="flex-grow overflow-auto space-y-4">
          <div className="space-y-2">
            <div className="font-semibold">Status</div>
            <Badge>{shoot.status}</Badge>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Scheduled Date</div>
            <div className="text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2 inline-block align-middle" />
              {formattedDate}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Client Information</div>
            {renderClientInfo(shoot.client)}
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Location</div>
            <div className="text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2 inline-block align-middle" />
              {shoot.location.fullAddress || `${shoot.location.address}, ${shoot.location.city}, ${shoot.location.state} ${shoot.location.zipCode || shoot.location.zip}`}
            </div>
          </div>

          {shoot.photographer && (
            <>
              <div className="space-y-2">
                <div className="font-semibold">Photographer</div>
                {renderPhotographerInfo(shoot.photographer)}
              </div>
              <Separator />
            </>
          )}

          <div className="space-y-2">
            <div className="font-semibold">Services</div>
            <ul className="list-disc list-inside text-muted-foreground">
              {shoot.services && shoot.services.length > 0 ? (
                shoot.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))
              ) : (
                <li>No services listed</li>
              )}
            </ul>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="font-semibold">Shoot Notes</div>
            {shoot.notes && (
              <p className="text-muted-foreground text-sm">
                {typeof shoot.notes === 'string' ? shoot.notes : ensureNotesObject(shoot.notes).shootNotes || 'No notes available'}
              </p>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="font-semibold">Tour Links</div>
            {shoot.tourLinks ? (
              <div className="space-y-1">
                {shoot.tourLinks.branded && (
                  <div className="text-sm text-muted-foreground">
                    Branded: <a className="underline" href={shoot.tourLinks.branded} target="_blank" rel="noopener noreferrer">
                      {shoot.tourLinks.branded}
                    </a>
                  </div>
                )}
                {shoot.tourLinks.mls && (
                  <div className="text-sm text-muted-foreground">
                    MLS: <a className="underline" href={shoot.tourLinks.mls} target="_blank" rel="noopener noreferrer">
                      {shoot.tourLinks.mls}
                    </a>
                  </div>
                )}
                {shoot.tourLinks.genericMls && (
                  <div className="text-sm text-muted-foreground">
                    Generic MLS: <a className="underline" href={shoot.tourLinks.genericMls} target="_blank" rel="noopener noreferrer">
                      {shoot.tourLinks.genericMls}
                    </a>
                  </div>
                )}
                {(!shoot.tourLinks.branded && !shoot.tourLinks.mls && !shoot.tourLinks.genericMls) && (
                  <div className="text-sm text-muted-foreground">No tour links available</div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No tour links available</div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="flex-grow overflow-auto">
          <ShootMediaTab shoot={shoot} />
        </TabsContent>
        
        <TabsContent value="notes" className="flex-grow overflow-auto">
          <ShootNotesTab 
            shoot={shoot} 
            isAdmin={isAdmin} 
            isPhotographer={isPhotographer}
            role={role}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const renderClientInfo = (client: ClientType) => (
  <div className="space-y-1">
    <div className="font-semibold">{client.name}</div>
    {client.company && <div className="text-sm text-muted-foreground">{client.company}</div>}
    <div className="text-sm text-muted-foreground">
      <Mail className="h-4 w-4 mr-1 inline-block align-middle" />
      {client.email}
    </div>
    {client.phone && (
      <div className="text-sm text-muted-foreground">
        <Phone className="h-4 w-4 mr-1 inline-block align-middle" />
        {client.phone}
      </div>
    )}
  </div>
);

const renderPhotographerInfo = (photographer: PhotographerType) => (
  <div className="flex items-center space-x-4">
    <Avatar>
      <AvatarImage src={photographer.avatar} alt={photographer.name} />
      <AvatarFallback>{photographer.name.substring(0, 2)}</AvatarFallback>
    </Avatar>
    <div className="space-y-1">
      <div className="font-semibold">{photographer.name}</div>
      {photographer.email && <div className="text-sm text-muted-foreground">{photographer.email}</div>}
      {photographer.phone && <div className="text-sm text-muted-foreground">{photographer.phone}</div>}
    </div>
  </div>
);
