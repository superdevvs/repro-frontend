
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
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
  LogOutIcon,
  XIcon,
  MenuIcon
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const MenuItem = ({ to, icon, label, isActive, onClick }: MenuItemProps) => {
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

const MobileMenu = () => {
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

  return (
    <>
      {/* Floating Action Button with Glassmorphism */}
      <motion.button
        className={cn(
          "fixed z-50 bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2",
          "px-4 py-2 rounded-full",
          "bg-primary/40 backdrop-blur-md shadow-lg border border-primary/20",
          "hover:bg-primary/50 transition-all duration-300"
        )}
        onClick={toggleMenu}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          y: [0, -5, 0],
          transition: { 
            repeat: isMenuOpen ? 0 : Infinity, 
            repeatType: "reverse", 
            duration: 1.5 
          }
        }}
      >
        {isMenuOpen ? (
          <>
            <XIcon className="text-primary-foreground h-5 w-5" />
            <span className="text-primary-foreground font-medium">Close</span>
          </>
        ) : (
          <>
            <MenuIcon className="text-primary-foreground h-5 w-5" />
            <span className="text-primary-foreground font-medium">Dashboard</span>
          </>
        )}
      </motion.button>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 backdrop-blur-md bg-background/80 flex flex-col overflow-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <HomeIcon className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">REPro Dashboard</span>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="flex-1 p-4 overflow-auto pb-20">
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.07
                    }
                  }
                }}
                initial="hidden"
                animate="show"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                  >
                    <MenuItem
                      to={item.to}
                      icon={item.icon}
                      label={item.label}
                      isActive={item.isActive}
                      onClick={closeMenu}
                    />
                  </motion.div>
                ))}
                
                {/* Logout Button */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <button
                    onClick={handleLogout}
                    className="w-full flex flex-col items-center justify-center gap-2 p-3 rounded-xl backdrop-blur-md bg-destructive/10 border border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-2xl text-destructive">
                      <LogOutIcon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;
