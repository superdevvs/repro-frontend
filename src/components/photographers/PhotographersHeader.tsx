
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface PhotographersHeaderProps {
  onAddClick: () => void;
}

export function PhotographersHeader({ onAddClick }: PhotographersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          Photographers
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Photographer Directory</h1>
        <p className="text-muted-foreground">
          Manage photographers and their availability
        </p>
      </div>
      
      <Button className="gap-2 hover:shadow-md transition-shadow" onClick={onAddClick}>
        <PlusIcon className="h-4 w-4" />
        Add Photographer
      </Button>
    </div>
  );
}
