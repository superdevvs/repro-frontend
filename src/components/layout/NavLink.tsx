
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

export function NavLink({ to, icon, label, isCollapsed, isActive }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary/50',
        isActive ? 'bg-secondary/80 font-medium' : 'text-muted-foreground',
        isCollapsed && 'justify-center p-2'
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
}
