
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  CalendarIcon,
  CameraIcon,
  HomeIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  SunIcon,
  UsersIcon,
  XIcon,
  MoonIcon,
  SettingsIcon,
  CreditCardIcon,
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { motion } from 'framer-motion';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { user, role } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const navItems = [
    { path: '/dashboard', icon: <LayoutDashboardIcon size={20} />, label: 'Dashboard', roles: ['admin', 'superadmin', 'photographer', 'client', 'editor'] },
    { path: '/shoots', icon: <CameraIcon size={20} />, label: 'Shoots', roles: ['admin', 'superadmin', 'photographer', 'client', 'editor'] },
    { path: '/book-shoot', icon: <CalendarIcon size={20} />, label: 'Book a Shoot', roles: ['admin', 'superadmin'] },
    { path: '/photographers', icon: <UsersIcon size={20} />, label: 'Photographers', roles: ['admin', 'superadmin'] },
    { path: '/clients', icon: <UsersIcon size={20} />, label: 'Clients', roles: ['admin', 'superadmin'] },
    { path: '/media', icon: <ImageIcon size={20} />, label: 'Media', roles: ['admin', 'superadmin', 'photographer', 'client', 'editor'] },
    { path: '/invoices', icon: <CreditCardIcon size={20} />, label: 'Invoices', roles: ['admin', 'superadmin', 'client'] },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings', roles: ['admin', 'superadmin', 'photographer', 'client', 'editor'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <motion.div
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-border relative transition-all",
        collapsed ? "w-[72px]" : "w-[240px]",
        className
      )}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <HomeIcon className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">RealEstate</span>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {collapsed ? <MenuIcon size={18} /> : <XIcon size={18} />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center px-0"
                )
              }
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <Separator />
      
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">{user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="flex-1 truncate">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
          )}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-auto">
            {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
