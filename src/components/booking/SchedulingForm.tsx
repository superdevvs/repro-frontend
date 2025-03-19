
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TimeSelect } from '@/components/ui/time-select';
import { CalendarIcon, CheckCircleIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface PhotographerType {
  id: string;
  name: string;
  avatar: string;
  rate: number;
  availability: boolean;
}

interface PackageType {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface SchedulingFormProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  photographer: string;
  setPhotographer: (id: string) => void;
  selectedPackage: string;
  setSelectedPackage: (id: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  photographers: PhotographerType[];
  packages: PackageType[];
  getAvailableTimes: () => string[];
}

export function SchedulingForm({
  date,
  setDate,
  time,
  setTime,
  photographer,
  setPhotographer,
  selectedPackage,
  setSelectedPackage,
  notes,
  setNotes,
  photographers,
  packages,
  getAvailableTimes
}: SchedulingFormProps) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Select Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(date) => {
                  return date < new Date(new Date().setHours(0, 0, 0, 0));
                }}
                modifiers={{
                  available: date ? [date] : [],
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="time">Select Time</Label>
          <TimeSelect 
            value={time}
            onChange={setTime}
            availableTimes={getAvailableTimes()}
            disabled={!date || !photographer}
            placeholder={
              !date 
                ? "Select a date first" 
                : !photographer 
                ? "Select a photographer first"
                : "Select a time"
            }
          />
        </div>
      </div>
      
      <div>
        <Label>Select Photographer</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
          {photographers.map((p) => (
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
          ))}
        </div>
      </div>
      
      <div>
        <Label>Select Package</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage === pkg.id 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'hover:border-primary/30 hover:bg-primary/5'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{pkg.name}</p>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${pkg.price}</p>
                    {selectedPackage === pkg.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center ml-auto">
                        <CheckCircleIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter any special instructions or requirements..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-24"
        />
      </div>
    </motion.div>
  );
}
