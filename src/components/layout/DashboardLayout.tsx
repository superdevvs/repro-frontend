
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { PageTransition } from './PageTransition';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string; // Add className prop to the interface
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className={`flex-1 overflow-y-auto p-6 pb-10 ${className || ''}`}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
