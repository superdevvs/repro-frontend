
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { PageTransition } from './PageTransition';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

// Changed from 'export function' to 'export const' to match import in Settings.tsx
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="h-full flex">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 pb-10">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

// Add default export to support both named and default imports
export default DashboardLayout;
