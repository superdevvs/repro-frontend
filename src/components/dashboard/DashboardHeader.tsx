
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  isAdmin: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isAdmin }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          Dashboard
        </Badge>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your shoots today.
        </p>
      </div>
      
      {isAdmin && (
        <Button onClick={() => navigate('/book-shoot')} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Book New Shoot
        </Button>
      )}
    </div>
  );
};
