
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MessageSquare,
  PenLine,
  DollarSignIcon,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { ShootData } from '@/types/shoots';
import { useAuth } from '@/components/auth/AuthProvider';
import { ShootDetailTabs } from './ShootDetailTabs';
import { MessageDialog } from './MessageDialog';
import { ShootActionsDialog } from './ShootActionsDialog';
import { useShoots } from '@/context/ShootsContext';
import { useToast } from '@/hooks/use-toast';
import { InvoiceData } from '@/utils/invoiceUtils';
import { PaymentDialog } from '@/components/invoices/PaymentDialog';

interface ShootDetailProps {
  shoot: ShootData | null;
  isOpen: boolean;
  onClose: () => void;
  onPay: (invoice: InvoiceData) => void;
  invoice?: InvoiceData;
}

export function ShootDetail({ shoot, isOpen, onClose, onPay, invoice }: ShootDetailProps) {
  const { role } = useAuth();
  const { updateShoot, deleteShoot } = useShoots();
  const [activeTab, setActiveTab] = useState("details");
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const isAdmin = ['admin', 'superadmin'].includes(role);
  const isPhotographer = role === 'photographer';

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

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

  const handleOpenMessageDialog = () => {
    setIsMessageDialogOpen(true);
  };

  const handleCloseMessageDialog = () => {
    setIsMessageDialogOpen(false);
  };

  const handleOpenEditDialog = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleMarkAsCompleted = () => {
    if (shoot && shoot.status === 'scheduled') {
      const now = new Date().toISOString().split('T')[0];
      updateShoot(shoot.id, {
        status: 'completed',
        completedDate: now
      });
    }
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteShoot = () => {
    if (shoot) {
      deleteShoot(shoot.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Shoot Deleted",
        description: `Shoot #${shoot.id} has been permanently deleted.`,
      });
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

            <Button variant="outline" onClick={handleOpenMessageDialog}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>

            {(isAdmin || isPhotographer) && shoot.status == 'scheduled' && (
              <Button onClick={handleOpenEditDialog}>
                <PenLine className="h-4 w-4 mr-2" />
                Edit Shoot
              </Button>
            )}

            {isPhotographer && shoot.status === 'scheduled' && isAdmin && (
              <Button onClick={handleMarkAsCompleted}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Completed
              </Button>
            )}

            {isAdmin && (
              <Button variant="destructive" onClick={handleOpenDeleteDialog}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}

            {(role === 'superadmin' || role === 'admin') && (
              <Button variant="default">
                <DollarSignIcon className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            )}

            {/* {(role === 'superadmin' || role === 'admin') && (
              <Button variant="default" onClick={() => setIsPaymentDialogOpen(true)}>
                <DollarSignIcon className="h-4 w-4 mr-2" />
                Process Payment
              </Button>
            )}
            <PaymentDialog
              isOpen={isPaymentDialogOpen}
              onClose={() => setIsPaymentDialogOpen(false)}
              invoice={invoice} // jo invoice pass kar rahe ho props se
              onConfirm={onPay} // yeh function tumhare InvoiceList se aa raha hai
            /> */}

            {/* {isAdmin && (invoice.status === "pending" || invoice.status === "overdue") && (
              <Button
                variant="accent"
                size="sm"
                onClick={() => onPay(invoice)}
                className="!px-3 py-1 text-xs"
                aria-label="process payment"
              >
                Process Payment
              </Button>
            )} */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {shoot && (
        <>
          <MessageDialog
            shoot={shoot}
            isOpen={isMessageDialogOpen}
            onClose={handleCloseMessageDialog}
          />

          <ShootActionsDialog
            shoot={shoot}
            isOpen={isEditDialogOpen}
            onClose={handleCloseEditDialog}
          />

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Shoot</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this shoot? This action cannot be undone
                  and all associated data will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteShoot} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
