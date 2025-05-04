
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarHeaderProps {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
}

export function SidebarHeader({ isCollapsed, toggleCollapsed }: SidebarHeaderProps) {
  return (
    <div className="flex h-14 items-center border-b px-2">
      <Link
        to="/"
        className={cn(
          'flex items-center gap-2 font-semibold',
          isCollapsed && 'justify-center w-full'
        )}
      >
        {isCollapsed ? (
          <HomeIcon className="h-6 w-6 text-primary" />
        ) : (
          <>
            <HomeIcon className="h-6 w-6 text-primary" />
            <span>REProDashboard</span>
          </>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'ml-auto h-8 w-8',
          isCollapsed && 'absolute -right-4 top-12 z-50 bg-background border shadow-sm'
        )}
        onClick={toggleCollapsed}
      >
        {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
      </Button>
    </div>
  );
}
