import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { getAuthenticatedClient } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { CouponCard } from './CouponCard';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

type Coupon = Database['public']['Tables']['coupons']['Row'];

export function CouponsList() {
  const { session } = useAuth();

  const { data: coupons, isLoading, error } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      if (!session?.access_token) {
        throw new Error('Authentication required to view coupons');
      }

      const client = getAuthenticatedClient(session);
      const { data, error } = await client
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching coupons:', error);
        throw error;
      }
      return data as Coupon[];
    },
    enabled: !!session?.access_token,
  });

  React.useEffect(() => {
    if (error) {
      toast.error(`Failed to load coupons: ${(error as Error).message}`);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="h-[250px] animate-pulse
                       bg-gray-100 border border-gray-200
                       dark:bg-slate-800 dark:border-slate-700"
          />
        ))}
      </div>
    );
  }

  if (!coupons?.length) {
    return (
      <div
        className="rounded-md p-8 text-center
                   bg-white border border-gray-200 text-gray-700
                   dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
      >
        <p className="text-lg font-medium mb-2">No Coupons Found</p>
        <p className="text-sm opacity-90">
          Create your first coupon by clicking the "Create Coupon" button above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {coupons.map((coupon) => (
        <div
          key={coupon.id}
          className="rounded-md"
        >
          <CouponCard coupon={coupon} />
        </div>
      ))}
    </div>
  );
}
