
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { TimeSelect } from '@/components/ui/time-select';
import { CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

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
  selectedPackage: string;
  notes: string;
  setNotes: (notes: string) => void;
  packages: PackageType[];
}

export function SchedulingForm({
  date,
  setDate,
  time,
  setTime,
  selectedPackage,
  notes,
  setNotes,
  packages
}: SchedulingFormProps) {
  // Generate available times based on selected date
  const getAvailableTimes = () => {
    if (!date) return [];
    
    // In a real app, this would be based on actual availability data
    return [
      "9:00 AM", 
      "10:00 AM", 
      "11:00 AM", 
      "1:00 PM", 
      "2:00 PM", 
      "3:00 PM"
    ];
  };

  const selectedPackageDetails = packages.find(p => p.id === selectedPackage);

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="mb-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-medium mb-2">Selected Package:</h3>
        {selectedPackageDetails ? (
          <div className="flex justify-between">
            <div>
              <p className="font-medium">{selectedPackageDetails.name}</p>
              <p className="text-sm text-muted-foreground">{selectedPackageDetails.description}</p>
            </div>
            <p className="font-bold">${selectedPackageDetails.price}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No package selected</p>
        )}
      </div>

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
            disabled={!date}
            placeholder={!date ? "Select a date first" : "Select a time"}
          />
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
