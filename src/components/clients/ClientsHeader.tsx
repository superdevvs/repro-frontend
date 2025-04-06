
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface ClientsHeaderProps {
  role: string;
  handleAddClient: () => void;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({ role, handleAddClient }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          Clients
        </Badge>
        <h1 className="text-3xl font-bold">Client Management</h1>
        <p className="text-muted-foreground">
          Manage client information and property shoots in the REPro Dashboard
        </p>
      </div>
      
      {['admin', 'superadmin'].includes(role) && (
        <Button className="gap-2" onClick={handleAddClient}>
          <PlusIcon className="h-4 w-4" />
          Add Client
        </Button>
      )}
    </div>
  );
};
