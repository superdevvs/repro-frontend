
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
      // Make sure we have an access token before making the request
      if (!session?.access_token) {
        throw new Error('Authentication required to view coupons');
      }
      
      // Use authenticated client
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
    enabled: !!session?.access_token, // Only run query if we have an access token
  });

  // Handle errors - but make sure this is outside of conditional rendering
  // to maintain consistent hook call ordering
  React.useEffect(() => {
    if (error) {
      toast.error(`Failed to load coupons: ${(error as Error).message}`);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[250px] animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (!coupons?.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-8 text-center text-gray-500">
        <p className="text-lg font-medium mb-2">No Coupons Found</p>
        <p>Create your first coupon by clicking the "Create Coupon" button above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {coupons.map((coupon) => (
        <CouponCard key={coupon.id} coupon={coupon} />
      ))}
    </div>
  );
}
