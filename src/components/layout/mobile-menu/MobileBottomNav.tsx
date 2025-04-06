
import React from 'react';
import { CameraIcon, CalendarIcon, HomeIcon, MessageSquareIcon, MoreHorizontalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MobileBottomNavProps {
  toggleMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ toggleMenu }) => {
  return (
    <div className="fixed bottom-0 left-0 z-40 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
        <NavItem to="/" icon={<HomeIcon />} label="Home" />
        <NavItem to="/shoots" icon={<CameraIcon />} label="Shoots" />
        <NewShootButton />
        <NavItem to="/shoots/calendar" icon={<CalendarIcon />} label="Calendar" />
        <NavItem 
          to="#" 
          icon={<MoreHorizontalIcon />} 
          label="More" 
          className="hover:bg-muted/50"
          onClick={(e) => {
            e.preventDefault();
            toggleMenu();
            return false;
          }} 
        />
      </div>
    </div>
  );
};

const NavItem = ({ 
  to, 
  icon, 
  label, 
  className, 
  badgeCount, 
  onClick 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  className?: string; 
  badgeCount?: number;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "inline-flex flex-col items-center justify-center px-2 relative hover:bg-muted/30 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground",
          className
        )
      }
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center">
        {badgeCount !== undefined && badgeCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full p-0 text-xs font-medium"
            variant="secondary"
          >
            {badgeCount > 99 ? "99+" : badgeCount}
          </Badge>
        )}
        <div className="text-center">{icon}</div>
        <span className="text-xs mt-0.5">{label}</span>
      </div>
    </NavLink>
  );
};

const NewShootButton = () => {
  return (
    <NavLink
      to="/book-shoot"
      className={({ isActive }) =>
        cn(
          "inline-flex flex-col items-center justify-center",
          isActive ? "text-primary" : "text-muted-foreground"
        )
      }
    >
      <Button size="icon" className="h-11 w-11 bg-primary text-primary-foreground rounded-full shadow-md hover:shadow-lg">
        <CameraIcon className="h-5 w-5" />
      </Button>
      <span className="text-xs mt-0.5">New Shoot</span>
    </NavLink>
  );
};
