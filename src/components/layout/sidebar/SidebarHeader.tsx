
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
    <div className="flex h-14 items-center border-b px-0 relative">
      <Link
        to="/"
        className={cn(
          "flex items-center justify-center",
          isCollapsed ? "w-full px-0" : "w-full"
        )}
      >
        <img
          src="/REPRO-HQ.png"
          alt="R/E Pro Photos Logo"
          className={cn(
            "h-8 w-auto object-contain",   // was h-10 → now h-8
            isCollapsed ? "scale-90" : ""
          )}
        />
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
