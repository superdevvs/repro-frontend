
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
import { cn } from '@/lib/utils';

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

  // Determine which dates should be marked as available
  const today = new Date();
  const nextThirtyDays = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i + 1);
    return date;
  });
  
  // Removing weekends for this example
  const availableDates = nextThirtyDays.filter(date => 
    date.getDay() !== 0 && date.getDay() !== 6
  );

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4">
        <Label className="text-base">Select a date</Label>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          <div className="md:col-span-3 h-full">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date() || !availableDates.some(d => d.toDateString() === date?.toDateString())}
              className={cn("rounded-md border shadow-sm p-3 bg-background")}
              modifiers={{
                available: availableDates,
              }}
              modifiersStyles={{
                available: {
                  fontWeight: 'bold'
                }
              }}
            />
          </div>
          
          <div className="md:col-span-4">
            <div className="border rounded-md h-full shadow-sm p-4 bg-background">
              <h3 className="font-medium mb-3">Available time slots</h3>
              {date ? (
                <div className="grid grid-cols-2 gap-2">
                  {getAvailableTimes().map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={time === t ? "default" : "outline"}
                      className={cn(
                        "w-full justify-center",
                        time === t && "bg-primary hover:bg-primary/90 text-primary-foreground"
                      )}
                      onClick={() => setTime(t)}
                    >
                      {t}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground text-sm">
                  Please select a date first
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter any special instructions or requirements..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-24 mt-2"
        />
      </div>
    </motion.div>
  );
}
