
import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuSectionProps {
  title: string;
  icon: ReactNode;
  isCollapsible?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  children: ReactNode;
}

export function MenuSection({
  title,
  icon,
  isCollapsible = false,
  isExpanded = true,
  onToggleExpand,
  children
}: MenuSectionProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs flex items-center p-1 pl-0 hover:bg-transparent"
          onClick={isCollapsible ? onToggleExpand : undefined}
        >
          {isCollapsible && (
            <ChevronDown 
              className={cn(
                "h-3.5 w-3.5 mr-1 transition-transform", 
                !isExpanded && "transform -rotate-90"
              )} 
            />
          )}
          {icon}
          <span className="font-semibold">{title}</span>
        </Button>
      </div>
      
      {(!isCollapsible || isExpanded) && (
        <div className="ml-3 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}
