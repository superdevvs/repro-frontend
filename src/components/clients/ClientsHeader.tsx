
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusIcon, UsersIcon } from 'lucide-react';

interface ClientsHeaderProps {
  role: string;
  handleAddClient: () => void;
  totalClients?: number;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({ 
  role, 
  handleAddClient,
  totalClients = 0
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <UsersIcon className="h-5 w-5 text-primary" />
          <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
            Clients
          </Badge>
          {totalClients > 0 && (
            <span className="text-sm text-muted-foreground">({totalClients})</span>
          )}
        </div>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground">
          Manage client information and property shoots in the REPro Dashboard
        </p>
      </div>
      
      {['admin', 'superadmin'].includes(role) && (
        <Button 
          className="gap-2 bg-primary text-white hover:bg-primary/90 transition-all" 
          onClick={handleAddClient}
        >
          <PlusIcon className="h-4 w-4" />
          Add New Client
        </Button>
      )}
    </div>
  );
};
