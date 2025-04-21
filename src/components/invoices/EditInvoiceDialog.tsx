import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, FileTextIcon, Plus, Minus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { InvoiceData } from '@/utils/invoiceUtils';
import { useToast } from '@/hooks/use-toast';

interface EditInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceData | null;
  onInvoiceEdit: (updatedInvoice: InvoiceData) => void;
}

export function EditInvoiceDialog({ isOpen, onClose, invoice, onInvoiceEdit }: EditInvoiceDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [client, setClient] = useState('');
  const [property, setProperty] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [services, setServices] = useState<string[]>(['Photography']);

  useEffect(() => {
    if (invoice) {
      setClient(invoice.client || '');
      setProperty(invoice.property || '');
      setAmount(invoice.amount?.toString() || '');
      setDate(invoice.date ? parseISO(invoice.date) : new Date());
      setDueDate(invoice.dueDate ? parseISO(invoice.dueDate) : new Date());
      setServices(invoice.services && invoice.services.length > 0 ? invoice.services : ['Photography']);
    }
  }, [invoice]);

  const handleAddService = () => setServices([...services, '']);

  const handleRemoveService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...services];
    updatedServices[index] = value;
    setServices(updatedServices);
  };

  const handleEditInvoice = (e: React.FormEvent) => {
    e.preventDefault();

    if (!client || !property || !amount || !services.length || services.some(service => !service)) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const formattedDueDate = format(dueDate, 'yyyy-MM-dd');

    const updatedInvoice: InvoiceData = {
      ...invoice!,
      client: client,
      property: property,
      date: formattedDate,
      dueDate: formattedDueDate,
      amount: parseFloat(amount),
      services: services.filter(service => service !== ''),
      // keep other fields as is (like status, number, etc)
    };

    setTimeout(() => {
      setLoading(false);
      onInvoiceEdit(updatedInvoice);
      toast({
        title: "Invoice Updated",
        description: `Invoice ${invoice?.number} has been updated successfully.`,
        variant: "default",
      });
      onClose();
    }, 1000);
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
          <DialogDescription>
            Update invoice details below and save changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEditInvoice} className="space-y-4 py-4">
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
                <>Saving...</>
              ) : (
                <>
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
