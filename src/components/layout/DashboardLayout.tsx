
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { PageTransition } from './PageTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileMenu from './MobileMenu';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className={`flex-1 overflow-y-auto p-3 pb-10 ${className || ''}`}>
          {children || <Outlet />}
        </main>
        {isMobile && <MobileMenu />}
      </div>
    </div>
  );
};

export default DashboardLayout;
