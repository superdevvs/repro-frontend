
import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  MailIcon, 
  PhoneIcon, 
  HomeIcon, 
  BuildingIcon 
} from 'lucide-react';
import { Client } from '@/types/clients';

interface ClientDetailsProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (client: Client) => void;
  onBookShoot: (client: Client, e: React.MouseEvent) => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({
  client,
  open,
  onOpenChange,
  onEdit,
  onBookShoot
}) => {
  const { role } = useAuth();

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Client Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {client.avatar ? (
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>
                          {client.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mb-4">
                        {client.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                    )}
                    <h2 className="text-xl font-bold">{client.name}</h2>
                    <p className="text-muted-foreground">{client.company}</p>
                    <Badge 
                      className={`mt-2 ${client.status === 'active' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}
                    >
                      {client.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-2/3 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MailIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <PhoneIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-muted-foreground">{client.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <HomeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Address</h3>
                        <p className="text-muted-foreground">{client.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <BuildingIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Company</h3>
                        <p className="text-muted-foreground">{client.company}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Client Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/20 rounded-md p-3">
                      <p className="text-sm text-muted-foreground">Total Shoots</p>
                      <p className="text-2xl font-bold">{client.shootsCount}</p>
                    </div>
                    
                    <div className="bg-secondary/20 rounded-md p-3">
                      <p className="text-sm text-muted-foreground">Last Activity</p>
                      <p className="text-2xl font-bold">{new Date(client.lastActivity).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end">
            {['admin', 'superadmin'].includes(role) && (
              <>
                <Button variant="outline" onClick={() => onEdit(client)}>Edit Client</Button>
                <Button onClick={(e) => onBookShoot(client, e as unknown as React.MouseEvent)}>Book Shoot</Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
