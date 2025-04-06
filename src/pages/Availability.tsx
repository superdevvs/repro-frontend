
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { PhotographerAvailability } from '@/types/shoots';
import { v4 as uuidv4 } from 'uuid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { photographers } from '@/constants/bookingSteps';

interface AvailabilityForm {
  startTime: string;
  endTime: string;
}

const Availability = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [availability, setAvailability] = useState<PhotographerAvailability[]>([]);
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>('');
  const [currentAvailability, setCurrentAvailability] = useState<PhotographerAvailability | null>(null);
  const [availabilityForm, setAvailabilityForm] = useState<AvailabilityForm>({
    startTime: '09:00',
    endTime: '17:00'
  });
  const { toast } = useToast();

  // Fix the availability data to include timeSlots
  const availabilityData: PhotographerAvailability[] = [
    {
      id: '1',
      photographerId: '1',
      photographerName: 'John Doe',
      date: new Date(2025, 3, 7).toISOString().split('T')[0], // Convert to string format "YYYY-MM-DD"
      timeSlots: [
        { start: '09:00', end: '12:00', booked: false },
        { start: '13:00', end: '17:00', booked: false }
      ],
      startTime: '09:00',
      endTime: '17:00'
    },
    {
      id: '2',
      photographerId: '1',
      photographerName: 'John Doe',
      date: new Date(2025, 3, 8).toISOString().split('T')[0], // Convert to string format
      timeSlots: [
        { start: '09:00', end: '12:00', booked: false },
        { start: '13:00', end: '17:00', booked: false }
      ],
      startTime: '09:00',
      endTime: '17:00'
    },
    {
      id: '3',
      photographerId: '2',
      photographerName: 'Jane Smith',
      date: new Date(2025, 3, 7).toISOString().split('T')[0], // Convert to string format
      timeSlots: [
        { start: '10:00', end: '14:00', booked: false },
        { start: '15:00', end: '18:00', booked: false }
      ],
      startTime: '10:00',
      endTime: '18:00'
    },
    {
      id: '4',
      photographerId: '2',
      photographerName: 'Jane Smith',
      date: new Date(2025, 3, 9).toISOString().split('T')[0], // Convert to string format
      timeSlots: [
        { start: '10:00', end: '14:00', booked: false },
        { start: '15:00', end: '18:00', booked: false }
      ],
      startTime: '10:00',
      endTime: '18:00'
    },
    {
      id: '5',
      photographerId: '3',
      photographerName: 'Mike Brown',
      date: new Date(2025, 3, 10).toISOString().split('T')[0], // Convert to string format
      timeSlots: [
        { start: '08:00', end: '12:00', booked: false },
        { start: '13:00', end: '16:00', booked: false }
      ],
      startTime: '08:00',
      endTime: '16:00'
    },
  ];

  useEffect(() => {
    setAvailability(availabilityData);
  }, []);

  useEffect(() => {
    if (selectedDate && selectedPhotographer) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const foundAvailability = availability.find(
        (item) => item.photographerId === selectedPhotographer && item.date === formattedDate
      );
      setCurrentAvailability(foundAvailability || null);
      if (foundAvailability) {
        setAvailabilityForm({
          startTime: foundAvailability.startTime || '09:00',
          endTime: foundAvailability.endTime || '17:00'
        });
      } else {
        setAvailabilityForm({ startTime: '09:00', endTime: '17:00' });
      }
    } else {
      setCurrentAvailability(null);
      setAvailabilityForm({ startTime: '09:00', endTime: '17:00' });
    }
  }, [selectedDate, selectedPhotographer, availability]);

  const handleAddAvailability = () => {
    if (!selectedDate || !selectedPhotographer) {
      toast({
        title: "Missing information",
        description: "Please select a date and photographer before adding availability.",
        variant: "destructive"
      });
      return;
    }

    const newAvailability: PhotographerAvailability = {
      id: uuidv4(),
      photographerId: selectedPhotographer,
      photographerName: photographers.find(p => p.id === selectedPhotographer)?.name || '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      timeSlots: [{
        start: availabilityForm.startTime || '09:00',
        end: availabilityForm.endTime || '17:00',
        booked: false
      }],
      startTime: availabilityForm.startTime || '09:00',
      endTime: availabilityForm.endTime || '17:00'
    };

    setAvailability([...availability, newAvailability]);
    toast({
      title: "Availability Added",
      description: "New availability slot has been added.",
    });
  };

  const handleSave = () => {
    if (!currentAvailability) return;
    
    // Format the date properly
    let dateToUse: string;
    if (selectedDate instanceof Date) {
      dateToUse = format(selectedDate, 'yyyy-MM-dd');
    } else {
      dateToUse = currentAvailability.date;
    }
    
    // Update the availability with proper timeSlots
    const updatedAvailability: PhotographerAvailability = {
      ...currentAvailability,
      date: dateToUse,
      photographerName: photographers.find(p => p.id === currentAvailability.photographerId)?.name || '',
      startTime: availabilityForm.startTime,
      endTime: availabilityForm.endTime,
      timeSlots: [{
        start: availabilityForm.startTime || currentAvailability.startTime || '09:00',
        end: availabilityForm.endTime || currentAvailability.endTime || '17:00',
        booked: false
      }]
    };

    setAvailability(availability.map(item =>
      item.id === currentAvailability.id ? updatedAvailability : item
    ));
    toast({
      title: "Availability Updated",
      description: "Availability slot has been updated.",
    });
  };

  const handleDelete = () => {
    if (!currentAvailability) return;
    setAvailability(availability.filter(item => item.id !== currentAvailability.id));
    toast({
      title: "Availability Deleted",
      description: "Availability slot has been deleted.",
    });
    setCurrentAvailability(null);
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-4 space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Photographer Availability</h1>
        <p className="text-muted-foreground">
          Manage photographer availability and schedule shoots.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="photographer">Select Photographer</Label>
            <Select value={selectedPhotographer} onValueChange={setSelectedPhotographer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a photographer" />
              </SelectTrigger>
              <SelectContent>
                {photographers.map((photographer) => (
                  <SelectItem key={photographer.id} value={photographer.id}>{photographer.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  {selectedDate ? (
                    format(selectedDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={false}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {selectedDate && selectedPhotographer && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Availability Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  type="time"
                  id="startTime"
                  value={availabilityForm.startTime}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  type="time"
                  id="endTime"
                  value={availabilityForm.endTime}
                  onChange={(e) => setAvailabilityForm({ ...availabilityForm, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {currentAvailability ? (
                <>
                  <Button variant="secondary" onClick={handleSave}>Save Availability</Button>
                  <Button variant="destructive" onClick={handleDelete}>Delete Availability</Button>
                </>
              ) : (
                <Button onClick={handleAddAvailability}>Add Availability</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Availability;
