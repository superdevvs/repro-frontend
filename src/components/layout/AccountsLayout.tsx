
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';

interface AccountsLayoutProps {
  children?: React.ReactNode;
}

export function AccountsLayout({ children }: AccountsLayoutProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <DashboardLayout>
      <div className={`container mx-auto py-6 px-4 md:px-6 space-y-6 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
        {children}
      </div>
    </DashboardLayout>
  );
}
