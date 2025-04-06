
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const MenuItem = ({ to, icon, label, isActive, onClick }: MenuItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-3 rounded-xl backdrop-blur-md bg-background/60 border border-background/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
        isActive ? "bg-secondary/90 border-primary/30" : "bg-background/60"
      )}
      onClick={onClick}
    >
      <div className="text-2xl text-primary">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};
