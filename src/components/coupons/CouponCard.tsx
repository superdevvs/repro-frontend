
import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  MoreVertical, 
  Ticket, 
  Calendar,
  Hash,
  RefreshCw 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Coupon = Database['public']['Tables']['coupons']['Row'];

interface CouponCardProps {
  coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps) {
  const { role } = useAuth();
  const isSuperAdmin = role === 'superadmin';

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 p-2">
            <Ticket className="h-full w-full text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">{coupon.code}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {coupon.type} - {coupon.amount}
              {coupon.type === 'percentage' ? '%' : ' USD'} off
            </p>
          </div>
        </div>

        {isSuperAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit Coupon</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Coupon
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            <span>
              {coupon.current_uses ?? 0} / {coupon.max_uses ?? '∞'} uses
            </span>
          </div>
          {coupon.valid_until && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Expires: {format(new Date(coupon.valid_until), 'MMM d, yyyy')}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-1">
        <Badge variant={coupon.is_active ? "default" : "secondary"}>
          {coupon.is_active ? "Active" : "Inactive"}
        </Badge>
      </CardFooter>
    </Card>
  );
}
