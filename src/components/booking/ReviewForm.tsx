
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { CheckCircleIcon, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReviewFormProps {
  client: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  area: number; // New prop to combine bedrooms, bathrooms, sqft
  date: Date | undefined;
  time: string;
  photographer: string;
  setPhotographer: (id: string) => void;
  selectedPackage: string;
  additionalNotes: string; // Renamed from notes to additionalNotes
  setAdditionalNotes: (value: string) => void; // Renamed from setNotes
  bypassPayment: boolean;
  setBypassPayment: (value: boolean) => void;
  sendNotification: boolean;
  setSendNotification: (value: boolean) => void;
  packagePrice: number; // Changed from getPackagePrice function to packagePrice value
  photographerRate: number;
  tax: number;
  total: number;
  photographers: Array<{ id: string; name: string; avatar: string; rate: number; availability: boolean }>;
  packages: Array<{ id: string; name: string; description: string; price: number }>;
  onConfirm: () => void; // Renamed from handleSubmit
  onBack: () => void; // Renamed from goBack
  onSubmit?: () => void;
  isLastStep?: boolean;
}

export function ReviewForm({
  client,
  address,
  city,
  state,
  zip,
  bedrooms,
  bathrooms,
  sqft,
  area,
  date,
  time,
  photographer,
  setPhotographer,
  selectedPackage,
  additionalNotes,
  setAdditionalNotes,
  bypassPayment,
  setBypassPayment,
  sendNotification,
  setSendNotification,
  packagePrice,
  photographerRate,
  tax,
  total,
  photographers,
  packages,
  onSubmit,
  onConfirm,
  onBack,
  isLastStep = false 
}: ReviewFormProps) {
  // Find the selected client, photographer, and package
  const selectedPackageDetails = packages.find(p => p.id === selectedPackage);
  
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        {/* <Label>Select Photographer</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {photographers.length > 0 ? (
            photographers.map((p) => (
              <Card
                key={p.id}
                className={`cursor-pointer transition-all ${
                  photographer === p.id 
                    ? 'border-primary/50 bg-primary/5' 
                    : p.availability 
                      ? 'hover:border-primary/30 hover:bg-primary/5' 
                      : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => p.availability && setPhotographer(p.id)}
              >
                <div className="p-4 flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {photographer === p.id && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    {/* <p className="text-xs text-muted-foreground">${p.rate}/shoot</p>
                    {!p.availability && (
                      <span className="text-[10px] text-muted-foreground">Unavailable</span>
                    )} 
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">No photographers available</h4>
                  <p className="text-sm text-muted-foreground">A photographer will be assigned to you after booking confirmation.</p>
                </div>
              </div>
            </div>
          )} 
        </div> */}
      </div>
      
      <div className="p-4 bg-muted/30 rounded-lg space-y-4">
        <h3 className="font-medium">Booking Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Client:</span>
            <span className="text-sm font-medium">{client ? `${client}` : "No client selected"}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Property:</span>
            <span className="text-sm font-medium">{address ? `${address}, ${city}, ${state} ${zip}` : "No address provided"}</span>
          </div>

          {/* <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Area:</span>
            <span className="text-sm font-medium">{area ? `${bedrooms}, ${bathrooms}, ${sqft}` : "No data provided"}</span>
          </div> */}
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date & Time:</span>
            <span className="text-sm font-medium">
              {date ? `${format(date, 'PPP')} at ${time || "No time selected"}` : "No date selected"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Package:</span>
            <span className="text-sm font-medium">{selectedPackageDetails?.name || "No package selected"}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Photographer:</span>
            <span className="text-sm font-medium">
              {photographers.find(p => p.id === photographer)?.name || (photographers.length === 0 ? "To be assigned" : "No photographer selected")}
            </span>
          </div>
          
          {additionalNotes && (
            <div className="pt-2">
              <span className="text-sm text-muted-foreground">Notes:</span>
              <p className="text-sm mt-1 bg-background p-2 rounded">{additionalNotes}</p>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm">Package:</span>
            <span className="text-sm">${packagePrice}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Photographer Fee:</span>
            <span className="text-sm">${photographerRate}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Tax (6%):</span>
            <span className="text-sm">${tax}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="bypass-payment">Bypass Payment</Label>
            <div className="text-sm text-muted-foreground">
              Client will be invoiced later
            </div>
          </div>
          <Switch
            id="bypass-payment"
            checked={bypassPayment}
            onCheckedChange={setBypassPayment}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="send-notification">Send Notification</Label>
            <div className="text-sm text-muted-foreground">
              Notify client and photographer
            </div>
          </div>
          <Switch
            id="send-notification"
            checked={sendNotification}
            onCheckedChange={setSendNotification}
          />
        </div>
      </div>

      {/* <div className="pt-4 mt-4 border-t border-[#1e2d4a]">
                <Button 
                  onClick={onSubmit} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-colors"
                >
                  <Check className="mr-2 h-4 w-4" /> Book Shoot
                </Button>
      </div> */}
    </motion.div>
  );
}