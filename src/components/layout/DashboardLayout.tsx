
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { PageTransition } from './PageTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from './MobileMenu';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Check if current route is messages
  const isMessagesRoute = location.pathname === '/messages';
  
  // Use different padding for messages page to maximize space
  const contentPadding = isMessagesRoute 
    ? (isMobile ? 'p-0' : 'p-0') 
    : (isMobile ? 'p-2 pb-20' : 'p-3 pb-10');
  
  return (
    <div className="h-full flex">
      {!isMobile && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className={`flex-1 overflow-y-auto ${contentPadding} ${className || ''}`}>
          {children || <Outlet />}
        </main>
        {isMobile && <MobileMenu />}
      </div>
    </div>
  );
};

export default DashboardLayout;
