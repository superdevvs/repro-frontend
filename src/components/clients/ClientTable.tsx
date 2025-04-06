
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  UserIcon,
  EditIcon,
  CameraIcon,
  ExternalLinkIcon,
  Trash2Icon,
  MoreHorizontalIcon
} from 'lucide-react';
import { Client } from '@/types/clients';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ClientTableProps {
  clients: Client[];
  onSelect: (client: Client) => void;
  onEdit: (client: Client, e: React.MouseEvent) => void;
  onBookShoot: (client: Client, e: React.MouseEvent) => void;
  onClientPortal: (client: Client, e: React.MouseEvent) => void;
  onDelete: (client: Client, e: React.MouseEvent) => void;
}

export const ClientTable: React.FC<ClientTableProps> = ({
  clients,
  onSelect,
  onEdit,
  onBookShoot,
  onClientPortal,
  onDelete
}) => {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-[300px]">Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead className="text-center">Shoots</TableHead>
            <TableHead>Last Activity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow 
                key={client.id} 
                className="cursor-pointer hover:bg-muted/30 transition-colors" 
                onClick={() => onSelect(client)}
              >
                <TableCell className="font-medium py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      {client.avatar ? (
                        <AvatarImage src={client.avatar} alt={client.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{client.name}</span>
                      {client.company && (
                        <span className="text-xs text-muted-foreground">{client.company}</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone || '—'}</TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50">
                    <CameraIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{client.shootsCount || 0}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {client.lastActivity ? new Date(client.lastActivity).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={client.status === 'active' 
                      ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' 
                      : 'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400'}
                  >
                    {client.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right p-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onSelect(client);
                      }}>
                        <UserIcon className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => onEdit(client, e)}>
                        <EditIcon className="h-4 w-4 mr-2" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => onBookShoot(client, e)}>
                        <CameraIcon className="h-4 w-4 mr-2" />
                        Book Shoot
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => onClientPortal(client, e)}>
                        <ExternalLinkIcon className="h-4 w-4 mr-2" />
                        Client Portal
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onClick={(e) => onDelete(client, e)}
                      >
                        <Trash2Icon className="h-4 w-4 mr-2" />
                        Delete Client
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center h-32">
                <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                  <UserIcon className="h-8 w-8 mb-2 opacity-20" />
                  <p className="font-medium">No clients found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
