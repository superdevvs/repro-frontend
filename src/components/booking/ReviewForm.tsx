
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { CheckCircleIcon } from 'lucide-react';

interface ReviewFormProps {
  client: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  date: Date | undefined;
  time: string;
  photographer: string;
  setPhotographer: (id: string) => void;
  selectedPackage: string;
  notes: string;
  bypassPayment: boolean;
  setBypassPayment: (value: boolean) => void;
  sendNotification: boolean;
  setSendNotification: (value: boolean) => void;
  getPackagePrice: () => number;
  getPhotographerRate: () => number;
  getTax: () => number;
  getTotal: () => number;
  clients: Array<{ id: string; name: string }>;
  photographers: Array<{ id: string; name: string; avatar: string; rate: number; availability: boolean }>;
  packages: Array<{ id: string; name: string; description: string; price: number }>;
}

export function ReviewForm({
  client,
  address,
  city,
  state,
  zip,
  date,
  time,
  photographer,
  setPhotographer,
  selectedPackage,
  notes,
  bypassPayment,
  setBypassPayment,
  sendNotification,
  setSendNotification,
  getPackagePrice,
  getPhotographerRate,
  getTax,
  getTotal,
  clients,
  photographers,
  packages
}: ReviewFormProps) {
  const selectedClient = clients.find(c => c.id === client);
  const selectedPhotographer = photographers.find(p => p.id === photographer);
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
        <Label>Select Photographer</Label>
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
                    <p className="text-xs text-muted-foreground">${p.rate}/shoot</p>
                    {!p.availability && (
                      <span className="text-[10px] text-muted-foreground">Unavailable</span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No photographers available for the selected date and time.</p>
              <p className="text-sm mt-1">Consider selecting a different date or time.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-muted/30 rounded-lg space-y-4">
        <h3 className="font-medium">Booking Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Client:</span>
            <span className="text-sm font-medium">{selectedClient?.name || "No client selected"}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Property:</span>
            <span className="text-sm font-medium">{address ? `${address}, ${city}, ${state} ${zip}` : "No address provided"}</span>
          </div>
          
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
            <span className="text-sm font-medium">{selectedPhotographer?.name || "No photographer selected"}</span>
          </div>
          
          {notes && (
            <div className="pt-2">
              <span className="text-sm text-muted-foreground">Notes:</span>
              <p className="text-sm mt-1 bg-background p-2 rounded">{notes}</p>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-sm">Package:</span>
            <span className="text-sm">${getPackagePrice()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Photographer Fee:</span>
            <span className="text-sm">${getPhotographerRate()}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm">Tax (6%):</span>
            <span className="text-sm">${getTax()}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${getTotal()}</span>
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
    </motion.div>
  );
}
