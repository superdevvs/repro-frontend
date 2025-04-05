
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { NavLink } from './NavLink';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  BarChart3Icon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
  FileTextIcon,
  UserIcon,
  BuildingIcon,
  MessageSquareIcon,
  HistoryIcon,
  CalendarIcon,
  ClipboardIcon,
  MapIcon,
} from 'lucide-react';

interface SidebarContentProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

export function SidebarContent({ isCollapsed, isMobile }: SidebarContentProps) {
  const { pathname } = useLocation();
  const { role, logout } = useAuth();
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-2">
        <Link
          to="/"
          className={cn(
            'flex items-center gap-2 font-semibold',
            isCollapsed && !isMobile && 'justify-center w-full'
          )}
        >
          {isCollapsed && !isMobile ? (
            <HomeIcon className="h-6 w-6 text-primary" />
          ) : (
            <>
              <HomeIcon className="h-6 w-6 text-primary" />
              <span>REPro Dashboard</span>
            </>
          )}
        </Link>
      </div>
      <ScrollArea
        className="flex-1 overflow-auto"
      >
        <div className={cn('flex flex-1 flex-col gap-2 p-2')}>
          <NavLink
            to="/dashboard"
            icon={<HomeIcon className="h-4 w-4" />}
            label="Dashboard"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/dashboard'}
          />
          
          {/* Show Book Shoot for both admins and clients */}
          <NavLink
            to="/book-shoot"
            icon={<ClipboardIcon className="h-4 w-4" />}
            label="Book Shoot"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/book-shoot'}
          />
          
          {/* Show appropriate shoots history based on user role */}
          {role === 'client' ? (
            <NavLink
              to="/shoot-history"
              icon={<HistoryIcon className="h-4 w-4" />}
              label="My Shoots"
              isCollapsed={isCollapsed && !isMobile}
              isActive={pathname === '/shoot-history'}
            />
          ) : (
            <NavLink
              to="/shoots"
              icon={<CalendarIcon className="h-4 w-4" />}
              label="Shoots History"
              isCollapsed={isCollapsed && !isMobile}
              isActive={pathname === '/shoots'}
            />
          )}
          
          {/* Add Virtual Tours link - available for all users */}
          <NavLink
            to="/virtual-tours"
            icon={<MapIcon className="h-4 w-4" />}
            label="Virtual Tours"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/virtual-tours'}
          />
          
          <NavLink
            to="/messages"
            icon={<MessageSquareIcon className="h-4 w-4" />}
            label="Messages"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/messages'}
          />
          
          {role !== 'client' && (
            <NavLink
              to="/clients"
              icon={<UserIcon className="h-4 w-4" />}
              label="Clients"
              isCollapsed={isCollapsed && !isMobile}
              isActive={pathname === '/clients'}
            />
          )}
          
          {['admin', 'superadmin'].includes(role) && (
            <NavLink
              to="/accounts"
              icon={<BuildingIcon className="h-4 w-4" />}
              label="Accounts"
              isCollapsed={isCollapsed && !isMobile}
              isActive={pathname === '/accounts'}
            />
          )}
          
          <NavLink
            to="/invoices"
            icon={<FileTextIcon className="h-4 w-4" />}
            label="Invoices"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/invoices'}
          />
          
          {role === 'superadmin' && (
            <NavLink
              to="/reports"
              icon={<BarChart3Icon className="h-4 w-4" />}
              label="Reports"
              isCollapsed={isCollapsed && !isMobile}
              isActive={pathname === '/reports'}
            />
          )}
          
          {role === 'admin' && (
            <NavLink
              to="/availability"
              icon={<UsersIcon className="h-4 w-4" />}
              label="Availability"
              isCollapsed={isCollapsed && !isMobile}
              isActive={pathname === '/availability'}
            />
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto">
        <Separator className="my-2" />
        <NavLink
          to="/settings"
          icon={<SettingsIcon className="h-4 w-4" />}
          label="Settings"
          isCollapsed={isCollapsed && !isMobile}
          isActive={pathname === '/settings'}
        />
        <Button
          variant="ghost"
          size={isCollapsed && !isMobile ? 'icon' : 'default'}
          className={cn(
            'w-full justify-start mt-2',
            isCollapsed && !isMobile && 'h-10 w-10 p-0'
          )}
          onClick={logout}
        >
          <LogOutIcon className="h-4 w-4 mr-2" />
          {(!isCollapsed || isMobile) && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}

// Helper function to concatenate class names
function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
