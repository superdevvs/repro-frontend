
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DashboardHeaderProps {
  isAdmin: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isAdmin }) => {
  return (
    <div>
      <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
        Dashboard
      </Badge>
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="text-muted-foreground">
        Here's what's happening with your shoots today.
      </p>
    </div>
  );
};
