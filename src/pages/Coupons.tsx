
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CouponsHeader } from '@/components/coupons/CouponsHeader';
import { CouponsList } from '@/components/coupons/CouponsList';
import { useAuth } from '@/components/auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Coupons = () => {
  const { role } = useAuth();
  
  // Only allow admin and superadmin to access this page
  if (!['admin', 'superadmin'].includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6 p-6">
          <CouponsHeader />
          <CouponsList />
        </div>
      </PageTransition>
    </DashboardLayout>
  );
};

export default Coupons;
