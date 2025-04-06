
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutToggleProps {
  isCompact: boolean;
  toggleLayout: () => void;
  className?: string;
}

export function LayoutToggle({ isCompact, toggleLayout, className }: LayoutToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLayout}
            className={cn("h-9 w-9 transition-all", className)}
          >
            {isCompact ? (
              <LayoutList className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCompact ? "Switch to standard layout" : "Switch to compact layout"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
