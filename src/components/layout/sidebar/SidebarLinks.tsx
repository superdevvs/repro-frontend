
import React from 'react';
import { useLocation } from 'react-router-dom';
import { NavLink } from './NavLink';
import { usePermission } from '@/hooks/usePermission';
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
  TicketIcon,
  Settings2Icon,
  MapPinIcon,
  TestTubeIcon,
} from 'lucide-react';

interface SidebarLinksProps {
  isCollapsed: boolean;
  role: string;
}

export function SidebarLinks({ isCollapsed, role }: SidebarLinksProps) {
  const { pathname } = useLocation();
  const permission = usePermission();
  
  // Define permissions for each section
  const dashboardPermission = permission.forResource('dashboard');
  const shootsPermission = permission.forResource('shoots');
  const clientsPermission = permission.forResource('clients');
  const accountsPermission = permission.forResource('accounts');
  const invoicesPermission = permission.forResource('invoices');
  const availabilityPermission = permission.forResource('availability');
  const integrationsPermission = permission.forResource('integrations');
  const settingsPermission = permission.forResource('settings');

  return (
    <div className="flex flex-1 flex-col gap-2 p-2">
      {/* Dashboard link - everyone with dashboard view permission can see this */}
      {dashboardPermission.canView() && (
        <NavLink
          to="/dashboard"
          icon={<HomeIcon className="h-5 w-5" />}
          label="Dashboard"
          isCollapsed={isCollapsed}
          isActive={pathname === '/dashboard'}
        />
      )}
      
      {/* Book Shoot link - only those who can book shoots */}
      {shootsPermission.canBook() && (
        <NavLink
          to="/book-shoot"
          icon={<ClipboardIcon className="h-5 w-5" />}
          label="Book Shoot"
          isCollapsed={isCollapsed}
          isActive={pathname === '/book-shoot'}
        />
      )}
      
      {/* Shoots History */}
      {shootsPermission.canView() && (
        <NavLink
          to={role === 'client' ? "/shoot-history" : "/shoots"}
          icon={role === 'client' ? <HistoryIcon className="h-5 w-5" /> : <CalendarIcon className="h-5 w-5" />}
          label="Shoots History"
          isCollapsed={isCollapsed}
          isActive={pathname === (role === 'client' ? '/shoot-history' : '/shoots')}
        />
      )}
      
      {/* Messages - all users can access */}
      <NavLink
        to="/messages"
        icon={<MessageSquareIcon className="h-5 w-5" />}
        label="Messages"
        isCollapsed={isCollapsed}
        isActive={pathname === '/messages'}
      />
      
      {/* Clients link */}
      {clientsPermission.canView() && role !== 'photographer' && role !== 'editor' && (
  <NavLink
    to="/clients"
    icon={<UserIcon className="h-5 w-5" />}
    label="Clients"
    isCollapsed={isCollapsed}
    isActive={pathname === '/clients'}
  />
)}

      
      {/* Accounts link */}
      {accountsPermission.canView() && (
        <>
          <NavLink
            to="/accounts"
            icon={<BuildingIcon className="h-5 w-5" />}
            label="Accounts"
            isCollapsed={isCollapsed}
            isActive={pathname === '/accounts'}
          />
          <NavLink
            to="/coupons"
            icon={<TicketIcon className="h-5 w-5" />}
            label="Coupons"
            isCollapsed={isCollapsed}
            isActive={pathname === '/coupons'}
          />
          <NavLink
            to="/scheduling-settings"
            icon={<Settings2Icon className="h-5 w-5" />}
            label="Scheduling"
            isCollapsed={isCollapsed}
            isActive={pathname === '/scheduling-settings'}
          />
        </>
      )}
      
      {/* Accounting */}
      {invoicesPermission.canView() && (
        <NavLink
          to="/accounting"
          icon={<BarChart3Icon className="h-5 w-5" />}
          label="Accounting"
          isCollapsed={isCollapsed}
          isActive={pathname === '/accounting'}
        />
      )}
      
      {/* Availability */}
      {availabilityPermission.canView() && (
        <NavLink
          to="/availability"
          icon={<CalendarIcon className="h-5 w-5" />}
          label="Availability"
          isCollapsed={isCollapsed}
          isActive={pathname === '/availability'}
        />
      )}
      
      {/* Integrations */}
      {integrationsPermission.canView() && (
        <NavLink
          to="/integrations"
          icon={<PlugIcon className="h-5 w-5" />}
          label="Integrations"
          isCollapsed={isCollapsed}
          isActive={pathname === '/integrations'}
        />
      )}
      
      {/* Development/Testing Links - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <div className="border-t border-gray-200 my-2"></div>
          <div className={`px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed && 'Testing'}
          </div>
          <NavLink
            to="/address-lookup-demo"
            icon={<MapPinIcon className="h-5 w-5" />}
            label="Address Lookup Demo"
            isCollapsed={isCollapsed}
            isActive={pathname === '/address-lookup-demo'}
          />
          <NavLink
            to="/book-shoot-enhanced"
            icon={<TestTubeIcon className="h-5 w-5" />}
            label="Enhanced Book Shoot"
            isCollapsed={isCollapsed}
            isActive={pathname === '/book-shoot-enhanced'}
          />
          <NavLink
            to="/test-client-form"
            icon={<ClipboardIcon className="h-5 w-5" />}
            label="Test Client Form"
            isCollapsed={isCollapsed}
            isActive={pathname === '/test-client-form'}
          />
        </>
      )}
    </div>
  );
}
