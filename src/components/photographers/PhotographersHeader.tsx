
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusIcon, Camera, Pen } from 'lucide-react';

interface PhotographersHeaderProps {
  onAddClick: () => void;
  activeTab: 'photographers' | 'editors';
}

export function PhotographersHeader({ onAddClick, activeTab }: PhotographersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
          {activeTab === 'photographers' ? 'Photographers' : 'Editors'}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          {activeTab === 'photographers' ? 'Photographer Directory' : 'Editor Directory'}
        </h1>
        <p className="text-muted-foreground">
          {activeTab === 'photographers' 
            ? 'Manage photographers and their availability' 
            : 'Manage editors and their availability'}
        </p>
      </div>
      
      <Button className="gap-2 hover:shadow-md transition-shadow" onClick={onAddClick}>
        <PlusIcon className="h-4 w-4" />
        Add {activeTab === 'photographers' ? 'Photographer' : 'Editor'}
      </Button>
    </div>
  );
}
