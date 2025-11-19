import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, FileTextIcon, Plus, Minus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceData, InvoiceItem, InvoiceTotals } from '@/utils/invoiceUtils';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@/components/auth/AuthProvider';

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreate: (invoice: InvoiceData) => void;
}

export function CreateInvoiceDialog({ isOpen, onClose, onInvoiceCreate }: CreateInvoiceDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [client, setClient] = useState('');
  const [property, setProperty] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000));
  const [services, setServices] = useState<string[]>(['Photography']);
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState<Role>('client');
  const [withItems, setWithItems] = useState(true);
  const [periodStart, setPeriodStart] = useState<Date>(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
  const [periodEnd, setPeriodEnd] = useState<Date>(new Date());

  const baseUrl = useMemo(() => {
    const url = import.meta.env.VITE_API_URL || '';
    return url.replace(/\/$/, '');
  }, []);
  
  const handleAddService = () => {
    setServices([...services, '']);
  };
  
  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };
  
  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!client || !property || !amount || !services.length || services.some(service => !service)) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!userId) {
      toast({
        title: "Validation Error",
        description: "A user ID is required to generate an invoice.",
        variant: "destructive",
      });
      return;
    }

    if (!periodStart || !periodEnd) {
      toast({
        title: "Validation Error",
        description: "Please select a valid billing period.",
        variant: "destructive",
      });
      return;
    }

    if (periodStart > periodEnd) {
      toast({
        title: "Validation Error",
        description: "The period start date must be before the end date.",
        variant: "destructive",
      });
      return;
    }

    if (!baseUrl) {
      toast({
        title: "Configuration Error",
        description: "API base URL is not configured.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const formattedDueDate = format(dueDate, 'yyyy-MM-dd');
    const formattedPeriodStart = format(periodStart, 'yyyy-MM-dd');
    const formattedPeriodEnd = format(periodEnd, 'yyyy-MM-dd');

    try {
      const response = await fetch(`${baseUrl}/api/admin/invoices/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          role,
          period: {
            start: formattedPeriodStart,
            end: formattedPeriodEnd,
          },
          with_items: withItems,
          metadata: {
            client,
            property,
            amount: Number(amount),
            invoice_date: formattedDate,
            due_date: formattedDueDate,
            services: services.filter(service => service !== ''),
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let message = 'Failed to generate invoice';

        if (errorText) {
          try {
            const parsed = JSON.parse(errorText);
            message = parsed.message || parsed.error || message;
          } catch {
            message = errorText;
          }
        }

        throw new Error(message);
      }

      const data = await response.json();
      const serverInvoice = data.invoice ?? data;
      const totals: InvoiceTotals | undefined = serverInvoice.totals ?? data.totals;
      const items: InvoiceItem[] | undefined = serverInvoice.items ?? data.items;

      const normalizedInvoice: InvoiceData = {
        id: serverInvoice.id ?? serverInvoice.number ?? `INV-${Date.now()}`,
        number: serverInvoice.number ?? serverInvoice.id ?? `INV-${Date.now()}`,
        client: serverInvoice.client ?? client,
        property: serverInvoice.property ?? property,
        date: serverInvoice.date ?? serverInvoice.issued_at ?? formattedDate,
        dueDate: serverInvoice.dueDate ?? serverInvoice.due_at ?? formattedDueDate,
        amount: Number(
          serverInvoice.amount ??
            serverInvoice.total ??
            totals?.total ??
            amount
        ),
        status: (serverInvoice.status ?? 'pending') as InvoiceData['status'],
        services:
          (Array.isArray(serverInvoice.services) && serverInvoice.services.length
            ? serverInvoice.services
            : services.filter(service => service !== '')) ?? [],
        paymentMethod:
          serverInvoice.paymentMethod ??
          serverInvoice.payment_method ??
          'Pending',
        totals,
        items,
        raw: serverInvoice,
      };

      onInvoiceCreate(normalizedInvoice);

      toast({
        title: "Invoice Created",
        description: `Invoice ${normalizedInvoice.number} has been created successfully.`,
        variant: "default",
      });

      setClient('');
      setProperty('');
      setAmount('');
      setDate(new Date());
      setDueDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000));
      setServices(['Photography']);
      setUserId('');
      setRole('client');
      setWithItems(true);
      setPeriodStart(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
      setPeriodEnd(new Date());

      onClose();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'An unexpected error occurred while generating the invoice.';

      toast({
        title: "Invoice Generation Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new invoice
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleCreateInvoice} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client Name</Label>
            <Input
              id="client"
              placeholder="Enter client name"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="property">Property Address</Label>
            <Input
              id="property"
              placeholder="Enter property address"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              placeholder="Enter associated user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="photographer">Photographer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withItems">Include Invoice Items</Label>
              <div className="flex items-center space-x-2 pt-1">
                <Checkbox
                  id="withItems"
                  checked={withItems}
                  onCheckedChange={(checked) => setWithItems(Boolean(checked))}
                />
                <Label htmlFor="withItems" className="text-sm text-muted-foreground">
                  Request detailed line items from the server
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Period Start</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {periodStart ? format(periodStart, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={periodStart}
                    onSelect={(value) => value && setPeriodStart(value)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Period End</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {periodEnd ? format(periodEnd, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={periodEnd}
                    onSelect={(value) => value && setPeriodEnd(value)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Services</Label>
            {services.map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Select
                  value={service}
                  onValueChange={(value) => handleServiceChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Photography">Photography</SelectItem>
                    <SelectItem value="Videography">Videography</SelectItem>
                    <SelectItem value="Drone">Drone</SelectItem>
                    <SelectItem value="Virtual Staging">Virtual Staging</SelectItem>
                    <SelectItem value="Floorplans">Floorplans</SelectItem>
                    <SelectItem value="3D Tour">3D Tour</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveService(index)}
                  disabled={services.length <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleAddService}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Invoice Amount ($)</Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.01"
              min="0"
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Create Invoice
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
