
import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCardIcon, CheckIcon, QrCodeIcon, AlertCircle } from "lucide-react";
import { InvoiceData } from '@/utils/invoiceUtils';
import { InvoiceApiError, InvoiceValidationErrors, markInvoicePaid } from '@/utils/invoiceApi';

interface PaymentDialogProps {
  invoice: InvoiceData | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete?: (result: PaymentResult) => void;
}

export interface PaymentResult {
  invoice?: InvoiceData;
  error?: string;
  validationErrors?: string[];
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  'credit-card': 'Credit Card',
  'bank-transfer': 'Bank Transfer',
  'square-upi': 'Square UPI',
  cash: 'Cash',
};

export function PaymentDialog({ invoice, isOpen, onClose, onPaymentComplete }: PaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [loading, setLoading] = useState(false);
  const [paidAt, setPaidAt] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!invoice) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;
    setLoading(true);
    setFormError(null);
    setValidationErrors([]);

    const isoPaidAt = paidAt ? new Date(paidAt).toISOString() : undefined;

    try {
      const updatedInvoice = await markInvoicePaid(
        invoice.id,
        {
          payment_method: paymentMethod,
          ...(isoPaidAt ? { paid_at: isoPaidAt } : {}),
        },
        invoice,
      );

      onPaymentComplete?.({ invoice: updatedInvoice });
      setPaidAt('');
      onClose();
    } catch (error) {
      const nextErrors: string[] = [];
      let message = 'Failed to process payment. Please try again.';
      if (error instanceof InvoiceApiError) {
        message = error.message || message;
        collectValidationErrors(error.details, nextErrors);
      } else if (error instanceof Error) {
        message = error.message || message;
      }

      setFormError(message);
      setValidationErrors(nextErrors);
      onPaymentComplete?.({
        error: message,
        validationErrors: nextErrors,
      });
    } finally {
      setLoading(false);
    }
  };

  const paymentMethodLabel = useMemo(() => {
    return PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod;
  }, [paymentMethod]);

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

          <div className="space-y-2">
            <Label htmlFor="paid-at">Paid At (optional)</Label>
            <Input
              id="paid-at"
              type="datetime-local"
              value={paidAt}
              onChange={(event) => setPaidAt(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to let the system use the server timestamp.
            </p>
          </div>

          {formError && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive flex flex-col gap-1">
              <span className="flex items-center gap-2 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                {formError}
              </span>
              {validationErrors.length > 0 && (
                <ul className="list-disc list-inside space-y-0.5 text-destructive">
                  {validationErrors.map((error, index) => (
                    <li key={`${error}-${index}`}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

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
                  Process {paymentMethodLabel}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const collectValidationErrors = (details: InvoiceValidationErrors, bucket: string[]) => {
  if (!details) return;
  if (typeof details === 'string') {
    bucket.push(details);
    return;
  }

  if (Array.isArray(details)) {
    details.forEach((value) => bucket.push(String(value)));
    return;
  }

  Object.entries(details).forEach(([field, messages]) => {
    if (Array.isArray(messages)) {
      messages.forEach((message) => bucket.push(`${field}: ${message}`));
    } else if (messages) {
      bucket.push(`${field}: ${messages}`);
    }
  });
};
