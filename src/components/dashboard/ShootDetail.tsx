import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, MapPin, Calendar, User, Mail, Phone, Link } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShootData, ShootStatus, Client, Photographer } from '@/types/shoots';
import { format } from 'date-fns';

interface ShootDetailProps {
  shoot: ShootData;
  isAdmin: boolean;
  isPhotographer: boolean;
  role: string;
}

export function ShootDetail({ shoot, isAdmin, isPhotographer, role }: ShootDetailProps) {

  // Add this helper function inside the component
  const getNotesObject = (notes: any): any => {
    if (typeof notes === 'string') {
      return { shootNotes: notes };
    }
    return notes || {};
  };

  const renderClientInfo = (client: Client) => (
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

  const renderPhotographerInfo = (photographer: Photographer) => (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={photographer.avatar} alt={photographer.name} />
        <AvatarFallback>{photographer.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="space-y-1">
        <div className="font-semibold">{photographer.name}</div>
        <div className="text-sm text-muted-foreground">{photographer.email}</div>
        {photographer.phone && <div className="text-sm text-muted-foreground">{photographer.phone}</div>}
      </div>
    </div>
  );

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), 'PPP');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{shoot.location.address}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit Shoot</DropdownMenuItem>
            <DropdownMenuItem>Cancel Shoot</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Invoice</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="font-semibold">Status</div>
          <Badge>{shoot.status}</Badge>
        </div>

        <div className="space-y-2">
          <div className="font-semibold">Scheduled Date</div>
          <div className="text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 inline-block align-middle" />
            {formatDate(shoot.scheduledDate)}
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="font-semibold">Client Information</div>
          {renderClientInfo(shoot.client)}
        </div>

        <div className="space-y-2">
          <div className="font-semibold">Location</div>
          <div className="text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 inline-block align-middle" />
            {shoot.location.fullAddress}
          </div>
        </div>
      </div>

      <Separator />

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
            {getNotesObject(shoot.notes).shootNotes || 'No notes available'}
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
                Branded: <Link className="underline" href={shoot.tourLinks.branded} target="_blank" rel="noopener noreferrer">
                  {shoot.tourLinks.branded}
                </Link>
              </div>
            )}
            {shoot.tourLinks.mls && (
              <div className="text-sm text-muted-foreground">
                MLS: <Link className="underline" href={shoot.tourLinks.mls} target="_blank" rel="noopener noreferrer">
                  {shoot.tourLinks.mls}
                </Link>
              </div>
            )}
            {shoot.tourLinks.genericMls && (
              <div className="text-sm text-muted-foreground">
                Generic MLS: <Link className="underline" href={shoot.tourLinks.genericMls} target="_blank" rel="noopener noreferrer">
                  {shoot.tourLinks.genericMls}
                </Link>
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
    </div>
  );
}
