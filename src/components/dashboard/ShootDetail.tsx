
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon,
  MessageSquare,
  PenLine,
  DollarSignIcon,
} from "lucide-react";
import { ShootData } from '@/types/shoots';
import { useAuth } from '@/components/auth/AuthProvider';
import { ShootDetailTabs } from './ShootDetailTabs';

interface ShootDetailProps {
  shoot: ShootData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShootDetail({ shoot, isOpen, onClose }: ShootDetailProps) {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const isAdmin = ['admin', 'superadmin'].includes(role);
  const isPhotographer = role === 'photographer';
  
  if (!shoot) return null;
  
  const getStatusBadge = (status: ShootData['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'hold':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPaymentStatus = () => {
    if (!shoot.payment.totalPaid) return <Badge variant="outline">Unpaid</Badge>;
    if (shoot.payment.totalPaid < shoot.payment.totalQuote) {
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Partial</Badge>;
    }
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Shoot Details</DialogTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(shoot.status)}
              {isAdmin && getPaymentStatus()}
            </div>
          </div>
          <DialogDescription>
            ID: #{shoot.id} • Created by: {shoot.createdBy || 'Unknown'}
          </DialogDescription>
        </DialogHeader>
        
        <ShootDetailTabs 
          shoot={shoot} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isAdmin={isAdmin} 
          isPhotographer={isPhotographer}
          role={role}
        />
        
        <DialogFooter className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          
          {isAdmin && (
            <>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button>
                <PenLine className="h-4 w-4 mr-2" />
                Edit Shoot
              </Button>
            </>
          )}
          
          {isPhotographer && shoot.status === 'scheduled' && (
            <Button>
              <CalendarIcon className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}
          
          {role === 'superadmin' && (
            <Button variant="default">
              <DollarSignIcon className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
