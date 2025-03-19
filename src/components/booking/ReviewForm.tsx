
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  CalendarIcon, 
  CameraIcon, 
  ClockIcon, 
  HeartIcon, 
  HomeIcon, 
  UserIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface ReviewFormProps {
  client: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  date: Date | undefined;
  time: string;
  photographer: string;
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
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Client</h3>
                <p className="text-muted-foreground">
                  {clients.find(c => c.id === client)?.name || 'Not selected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HomeIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Property</h3>
                <p className="text-muted-foreground">
                  {address ? `${address}, ${city}, ${state} ${zip}` : 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Date & Time</h3>
                <p className="text-muted-foreground">
                  {date ? format(date, 'MMMM d, yyyy') : 'Not selected'} {time ? `at ${time}` : ''}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CameraIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Photographer</h3>
                <p className="text-muted-foreground">
                  {photographers.find(p => p.id === photographer)?.name || 'Not selected'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <HeartIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h3 className="font-medium">Package</h3>
                <p className="text-muted-foreground">
                  {packages.find(p => p.id === selectedPackage)?.name || 'Not selected'} - 
                  {packages.find(p => p.id === selectedPackage)?.description || ''}
                </p>
              </div>
            </div>
            
            {notes && (
              <div className="flex items-start gap-3">
                <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium">Notes</h3>
                  <p className="text-muted-foreground">{notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Package</span>
            <span>${getPackagePrice()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Photographer Fee</span>
            <span>${getPhotographerRate()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax ({state === 'MD' ? '6%' : state === 'VA' ? '5.3%' : '6%'})</span>
            <span>${getTax()}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold">${getTotal()}</span>
          </div>
        </div>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="bypass-payment">Bypass Payment</Label>
              <p className="text-xs text-muted-foreground">Allow access before payment is received</p>
            </div>
            <Switch
              id="bypass-payment"
              checked={bypassPayment}
              onCheckedChange={setBypassPayment}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="send-notification">Send Notifications</Label>
              <p className="text-xs text-muted-foreground">Notify photographer and client via email/SMS</p>
            </div>
            <Switch
              id="send-notification"
              checked={sendNotification}
              onCheckedChange={setSendNotification}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
