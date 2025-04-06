
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MailIcon, 
  PhoneIcon, 
  BuildingIcon, 
  MoreHorizontalIcon,
  CalendarIcon,
  CameraIcon,
  MapPinIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ClientCard, 
  ClientCardContent, 
  ClientCardFooter, 
  ClientCardHeader 
} from '@/components/ui/card';
import { Client } from '@/types/clients';

interface ClientCardComponentProps {
  client: Client;
  onSelect: (client: Client) => void;
  onEdit: (client: Client, e: React.MouseEvent) => void;
  onBookShoot: (client: Client, e: React.MouseEvent) => void;
  onClientPortal: (client: Client, e: React.MouseEvent) => void;
  onDelete: (client: Client, e: React.MouseEvent) => void;
}

export const ClientCardComponent: React.FC<ClientCardComponentProps> = ({
  client,
  onSelect,
  onEdit,
  onBookShoot,
  onClientPortal,
  onDelete
}) => {
  const statusColors = {
    active: 'border-green-500/50 text-green-500 bg-green-50/50',
    inactive: 'border-gray-500/50 text-gray-500 bg-gray-50/50'
  };

  return (
    <ClientCard onClick={() => onSelect(client)} className="transform transition-all hover:translate-y-[-2px] hover:shadow">
      <ClientCardHeader className="bg-gradient-to-r from-primary/5 to-secondary/20">
        <div className="absolute -bottom-10 left-4">
          <Avatar className="h-20 w-20 border-4 border-background shadow-md">
            {client.avatar ? (
              <AvatarImage src={client.avatar} alt={client.name} />
            ) : (
              <AvatarFallback className="text-lg bg-primary/10 text-primary font-medium">
                {client.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </ClientCardHeader>
      
      <ClientCardContent className="pt-12">
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg leading-tight">{client.name}</h3>
            <Badge 
              variant="outline" 
              className={`self-start ${client.status === 'active' 
                ? statusColors.active
                : statusColors.inactive}`}
            >
              {client.status}
            </Badge>
          </div>
          {client.company && (
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <BuildingIcon className="h-3.5 w-3.5 inline" />
              {client.company}
            </p>
          )}
        </div>
        
        <div className="space-y-2.5">
          <div className="client-info-row">
            <MailIcon className="h-4 w-4 client-info-icon" />
            <span className="truncate">{client.email}</span>
          </div>
          
          {client.phone && (
            <div className="client-info-row">
              <PhoneIcon className="h-4 w-4 client-info-icon" />
              <span>{client.phone}</span>
            </div>
          )}
          
          {client.address && (
            <div className="client-info-row">
              <MapPinIcon className="h-4 w-4 client-info-icon" />
              <span className="truncate">{client.address}</span>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <div className="bg-muted/30 rounded-md px-2 py-1 flex items-center gap-1">
              <CameraIcon className="h-3 w-3 text-primary/80" />
              <span className="text-xs font-medium">{client.shootsCount || 0} shoots</span>
            </div>
            
            {client.lastActivity && (
              <div className="bg-muted/30 rounded-md px-2 py-1 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3 text-primary/80" />
                <span className="text-xs font-medium">
                  {new Date(client.lastActivity).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </ClientCardContent>
      
      <ClientCardFooter className="flex justify-between border-t bg-muted/10">
        <Button variant="secondary" size="sm" className="px-4" onClick={(e) => {
          e.stopPropagation();
          onBookShoot(client, e);
        }}>
          Book Shoot
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit(client, e);
            }}>
              Edit Client
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onClientPortal(client, e);
            }}>
              Client Portal
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(client, e);
              }}
            >
              Delete Client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ClientCardFooter>
    </ClientCard>
  );
};
