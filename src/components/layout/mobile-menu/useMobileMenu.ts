
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  HomeIcon, 
  ClipboardIcon, 
  HistoryIcon, 
  MessageSquareIcon, 
  UserIcon, 
  BuildingIcon, 
  FileTextIcon, 
  CalendarIcon, 
  SettingsIcon, 
  LogOutIcon
} from 'lucide-react';

export const useMobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, role, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  // Define menu items based on user role
  const menuItems = [
    {
      to: "/dashboard",
      icon: <HomeIcon className="h-6 w-6" />,
      label: "Dashboard",
      isActive: pathname === '/dashboard',
      roles: ['client', 'admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/book-shoot",
      icon: <ClipboardIcon className="h-6 w-6" />,
      label: "Book Shoot",
      isActive: pathname === '/book-shoot',
      roles: ['client', 'admin', 'superadmin']
    },
    role === 'client' ? {
      to: "/shoot-history",
      icon: <HistoryIcon className="h-6 w-6" />,
      label: "Shoots History",
      isActive: pathname === '/shoot-history',
      roles: ['client']
    } : {
      to: "/shoots",
      icon: <CalendarIcon className="h-6 w-6" />,
      label: "Shoots History",
      isActive: pathname === '/shoots',
      roles: ['admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/messages",
      icon: <MessageSquareIcon className="h-6 w-6" />,
      label: "Messages",
      isActive: pathname === '/messages',
      roles: ['client', 'admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/clients",
      icon: <UserIcon className="h-6 w-6" />,
      label: "Clients",
      isActive: pathname === '/clients',
      roles: ['admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/accounts",
      icon: <BuildingIcon className="h-6 w-6" />,
      label: "Accounts",
      isActive: pathname === '/accounts',
      roles: ['admin', 'superadmin']
    },
    {
      to: "/invoices",
      icon: <FileTextIcon className="h-6 w-6" />,
      label: "Invoices",
      isActive: pathname === '/invoices',
      roles: ['client', 'admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/availability",
      icon: <CalendarIcon className="h-6 w-6" />,
      label: "Availability",
      isActive: pathname === '/availability',
      roles: ['admin', 'photographer']
    },
    {
      to: "/settings",
      icon: <SettingsIcon className="h-6 w-6" />,
      label: "Settings",
      isActive: pathname === '/settings',
      roles: ['client', 'admin', 'superadmin', 'photographer', 'editor']
    }
  ];

  // Filter items based on user role
  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    handleLogout,
    filteredItems
  };
};
