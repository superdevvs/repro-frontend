
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion } from 'framer-motion';
import {
  BarChart3Icon,
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardIcon,
  HomeIcon,
  ImageIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  MenuIcon,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
}

export function Sidebar({ className, collapsed: propCollapsed }: SidebarProps) {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Initialize from localStorage if available
    const savedState = localStorage.getItem('sidebarCollapse');
    return savedState ? savedState === 'true' : false;
  });
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, logout } = useAuth();
  
  // If collapsed prop is provided, use it (for controlled collapsing)
  useEffect(() => {
    if (propCollapsed !== undefined) {
      setIsCollapsed(propCollapsed);
    }
  }, [propCollapsed]);
  
  // Save collapse state to localStorage when changed
  useEffect(() => {
    localStorage.setItem('sidebarCollapse', isCollapsed.toString());
  }, [isCollapsed]);
  
  // Close mobile sidebar when navigating or screen size changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, isMobile]);
  
  const SidebarContent = () => (
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
            <CameraIcon className="h-6 w-6 text-primary" />
          ) : (
            <>
              <CameraIcon className="h-6 w-6 text-primary" />
              <span>REPro Dashboard</span>
            </>
          )}
        </Link>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'ml-auto h-8 w-8',
              isCollapsed && 'absolute -right-4 top-12 z-50 bg-background border shadow-sm'
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
          </Button>
        )}
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
          <NavLink
            to="/shoots"
            icon={<CameraIcon className="h-4 w-4" />}
            label="Shoots"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/shoots'}
          />
          {['admin', 'superadmin'].includes(role) && (
            <NavLink
              to="/book-shoot"
              icon={<ClipboardIcon className="h-4 w-4" />}
              label="Book Shoot"
              isCollapsed={isCollapsed && !isMobile}
              isActive={pathname === '/book-shoot'}
            />
          )}
          <NavLink
            to="/photographers"
            icon={<UsersIcon className="h-4 w-4" />}
            label="Photographers"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/photographers'}
          />
          <NavLink
            to="/clients"
            icon={<UserIcon className="h-4 w-4" />}
            label="Clients"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/clients'}
          />
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
            to="/media"
            icon={<ImageIcon className="h-4 w-4" />}
            label="Media"
            isCollapsed={isCollapsed && !isMobile}
            isActive={pathname === '/media'}
          />
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
              icon={<CalendarIcon className="h-4 w-4" />}
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
  
  if (isMobile) {
    return (
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 fixed z-50 bottom-5 right-5 rounded-full bg-primary text-primary-foreground shadow-lg">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 80 : 240,
      }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className={cn(
        'group border-r bg-background p-3 py-4 relative hidden md:block',
        isCollapsed && 'items-center',
        className
      )}
    >
      <SidebarContent />
    </motion.div>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

function NavLink({ to, icon, label, isCollapsed, isActive }: NavLinkProps) {
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
