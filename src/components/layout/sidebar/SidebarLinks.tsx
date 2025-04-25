import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from './NavLink';
import {
  HomeIcon,
  ClipboardIcon,
  HistoryIcon,
  MessageSquareIcon,
  UserIcon,
  BuildingIcon,
  CalendarIcon,
  BarChart3Icon,
  PlugIcon,
} from 'lucide-react';

interface SidebarLinksProps {
  isCollapsed: boolean;
  role: string;
}

export function SidebarLinks({ isCollapsed, role }: SidebarLinksProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-1 flex-col gap-2 p-2">
      <NavLink
        to="/dashboard"
        icon={<HomeIcon className="h-5 w-5" />}
        label="Dashboard"
        isCollapsed={isCollapsed}
        isActive={pathname === '/dashboard'}
      />
      
      {/* Show Book Shoot based on role */}
      {['client', 'admin', 'superadmin'].includes(role) && (
        <NavLink
          to="/book-shoot"
          icon={<ClipboardIcon className="h-5 w-5" />}
          label="Book Shoot"
          isCollapsed={isCollapsed}
          isActive={pathname === '/book-shoot'}
        />
      )}
      
      {/* Show appropriate shoots history based on user role */}
      {role === 'client' ? (
        <NavLink
          to="/shoot-history"
          icon={<HistoryIcon className="h-5 w-5" />}
          label="Shoots History"
          isCollapsed={isCollapsed}
          isActive={pathname === '/shoot-history'}
        />
      ) : (
        <NavLink
          to="/shoots"
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Shoots History"
          isCollapsed={isCollapsed}
          isActive={pathname === '/shoots'}
        />
      )}
      
      <NavLink
        to="/messages"
        icon={<MessageSquareIcon className="h-5 w-5" />}
        label="Messages"
        isCollapsed={isCollapsed}
        isActive={pathname === '/messages'}
      />
      
      {/* Show Clients link only for specific roles */}
      {['admin', 'superadmin', 'photographer', 'editor'].includes(role) && (
        <NavLink
          to="/clients"
          icon={<UserIcon className="h-5 w-5" />}
          label="Clients"
          isCollapsed={isCollapsed}
          isActive={pathname === '/clients'}
        />
      )}
      
      {/* Show Accounts link only for admin roles */}
      {['admin', 'superadmin'].includes(role) && (
        <NavLink
          to="/accounts"
          icon={<BuildingIcon className="h-5 w-5" />}
          label="Accounts"
          isCollapsed={isCollapsed}
          isActive={pathname === '/accounts'}
        />
      )}
      
      {/* Replace Invoices with Accounting */}
      <NavLink
        to="/accounting"
        icon={<BarChart3Icon className="h-5 w-5" />}
        label="Accounting"
        isCollapsed={isCollapsed}
        isActive={pathname === '/accounting'}
      />
      
      {/* Show Availability for admin and photographer */}
      {['admin', 'photographer', 'superadmin'].includes(role) && (
        <NavLink
          to="/availability"
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Availability"
          isCollapsed={isCollapsed}
          isActive={pathname === '/availability'}
        />
      )}
      
      {/* Show Integrations only for superadmin */}
      {['admin', 'superadmin'].includes(role) && (
        <NavLink
          to="/integrations"
          icon={<PlugIcon className="h-5 w-5" />}
          label="Integrations"
          isCollapsed={isCollapsed}
          isActive={pathname === '/integrations'}
        />
      )}
    </div>
  );
}
