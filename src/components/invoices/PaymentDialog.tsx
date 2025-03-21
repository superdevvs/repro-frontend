
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCardIcon, CheckIcon, QrCodeIcon } from "lucide-react";
import { InvoiceData } from '@/utils/invoiceUtils';
import { useToast } from '@/hooks/use-toast';

interface PaymentDialogProps {
  invoice: InvoiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: (invoiceId: string, paymentMethod: string) => void;
}

export function PaymentDialog({ invoice, isOpen, onClose, onPaymentComplete }: PaymentDialogProps) {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [loading, setLoading] = useState(false);

  if (!invoice) return null;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Get the display name for the payment method
    const paymentMethodDisplay = 
      paymentMethod === "credit-card" ? "Credit Card" : 
      paymentMethod === "bank-transfer" ? "Bank Transfer" : 
      paymentMethod === "square-upi" ? "Square UPI" : "Cash";
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      // Call the onPaymentComplete callback to update the invoice status and payment method
      if (onPaymentComplete) {
        onPaymentComplete(invoice.id, paymentMethodDisplay);
      }
      
      toast({
        title: "Payment Successful",
        description: `Payment for invoice ${invoice.id} has been processed.`,
        variant: "default",
      });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>
            Complete payment for invoice #{invoice.id} totaling ${invoice.amount.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handlePayment} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                <SelectItem value="square-upi">Square UPI</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {paymentMethod === "credit-card" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
            </>
          )}
          
          {paymentMethod === "bank-transfer" && (
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input id="reference" placeholder="Enter reference number" required />
            </div>
          )}
          
          {paymentMethod === "square-upi" && (
            <div className="space-y-2">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input id="upi-id" placeholder="example@upi" required />
              <div className="mt-2 p-4 bg-muted/40 rounded-lg flex flex-col items-center">
                <QrCodeIcon className="h-24 w-24 text-primary/70 mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Scan this QR code with your Square UPI app to make payment
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.01" 
              defaultValue={invoice.amount.toFixed(2)} 
              required 
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  {paymentMethod === "credit-card" ? (
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                  ) : paymentMethod === "square-upi" ? (
                    <QrCodeIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckIcon className="h-4 w-4 mr-2" />
                  )}
                  Process Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
