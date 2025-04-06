
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

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
      icon: "Home",
      label: "Dashboard",
      isActive: pathname === '/dashboard',
      roles: ['client', 'admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/book-shoot",
      icon: "Clipboard",
      label: "Book Shoot",
      isActive: pathname === '/book-shoot',
      roles: ['client', 'admin', 'superadmin']
    },
    role === 'client' ? {
      to: "/shoot-history",
      icon: "History",
      label: "Shoots History",
      isActive: pathname === '/shoot-history',
      roles: ['client']
    } : {
      to: "/shoots",
      icon: "Calendar",
      label: "Shoots History",
      isActive: pathname === '/shoots',
      roles: ['admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/messages",
      icon: "MessageSquare",
      label: "Messages",
      isActive: pathname === '/messages',
      roles: ['client', 'admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/clients",
      icon: "User",
      label: "Clients",
      isActive: pathname === '/clients',
      roles: ['admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/accounts",
      icon: "Building",
      label: "Accounts",
      isActive: pathname === '/accounts',
      roles: ['admin', 'superadmin']
    },
    {
      to: "/invoices",
      icon: "FileText",
      label: "Invoices",
      isActive: pathname === '/invoices',
      roles: ['client', 'admin', 'superadmin', 'photographer', 'editor']
    },
    {
      to: "/availability",
      icon: "Calendar",
      label: "Availability",
      isActive: pathname === '/availability',
      roles: ['admin', 'photographer']
    },
    {
      to: "/settings",
      icon: "Settings",
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
