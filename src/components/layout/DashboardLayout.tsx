
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { PageTransition } from './PageTransition';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export function DashboardLayout({ children, sidebarCollapsed }: DashboardLayoutProps) {
  const location = useLocation();
  
  // Apply any animations settings from localStorage
  useEffect(() => {
    const animationsEnabled = localStorage.getItem('animations') !== 'false';
    document.documentElement.classList.toggle('reduce-motion', !animationsEnabled);
  }, []);

  return (
    <div className="h-full flex">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
