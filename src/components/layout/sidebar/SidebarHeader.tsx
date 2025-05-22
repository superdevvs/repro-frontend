
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

export function SidebarHeader({ isCollapsed, toggleCollapsed }: SidebarHeaderProps) {
  return (
    <div className="flex h-14 items-center justify-center border-b px-2 relative">
      <Link
        to="/"
        className={cn(
          'flex items-center',
          isCollapsed ? 'w-full px-2 justify-center' : 'w-full px-4'
        )}
      >
        <img 
          src="/lovable-uploads/b2e1d77f-fa76-4e07-87f5-a4820c7a1396.png" 
          alt="RePro Photos Logo"
          className={cn(
            "h-10 w-auto object-contain",
            isCollapsed ? "scale-90" : ""
          )}
        />
        {!isCollapsed && (
          <span className="ml-2 font-semibold text-lg whitespace-nowrap">RePro Photos</span>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'absolute right-2 h-8 w-8',
          isCollapsed && '-right-4 top-12 z-50 bg-background border shadow-sm'
        )}
        onClick={toggleCollapsed}
      >
        {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
