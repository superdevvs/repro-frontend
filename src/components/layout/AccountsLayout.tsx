
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/components/auth/AuthProvider';

interface AccountsLayoutProps {
  children?: React.ReactNode;
}

export function AccountsLayout({ children }: AccountsLayoutProps) {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="container py-6 px-4 md:px-6">
        {children}
      </div>
    </DashboardLayout>
  );
}
