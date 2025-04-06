
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MailIcon, 
  PhoneIcon, 
  BuildingIcon, 
  MoreHorizontalIcon,
  CalendarIcon,
  CameraIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
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
  return (
    <ClientCard onClick={() => onSelect(client)}>
      <ClientCardHeader>
        <div className="absolute -bottom-10 left-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            {client.avatar ? (
              <AvatarImage src={client.avatar} alt={client.name} />
            ) : (
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {client.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </ClientCardHeader>
      
      <ClientCardContent className="pt-12">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg">{client.name}</h3>
          <Badge 
            variant="outline" 
            className={`self-start ${client.status === 'active' 
              ? 'border-green-500/50 text-green-500' 
              : 'border-gray-500/50 text-gray-500'}`}
          >
            {client.status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {client.company && (
            <div className="client-info-row">
              <BuildingIcon className="h-4 w-4 client-info-icon" />
              <span>{client.company}</span>
            </div>
          )}
          
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
          
          <div className="flex gap-3 pt-1">
            <div className="bg-muted/30 rounded-md px-2 py-1 flex items-center gap-1">
              <CameraIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">{client.shootsCount || 0} shoots</span>
            </div>
            
            {client.lastActivity && (
              <div className="bg-muted/30 rounded-md px-2 py-1 flex items-center gap-1">
                <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">
                  {new Date(client.lastActivity).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </ClientCardContent>
      
      <ClientCardFooter>
        <Button variant="outline" size="sm" onClick={(e) => {
          e.stopPropagation();
          onBookShoot(client, e);
        }}>
          Book Shoot
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
            <DropdownMenuItem 
              className="text-red-500 focus:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(client, e);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ClientCardFooter>
    </ClientCard>
  );
};
