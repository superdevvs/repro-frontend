
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format, parse, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Clock, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample availability periods
const initialAvailabilities = [
  {
    id: "1",
    date: "2025-04-10",
    startTime: "09:00",
    endTime: "17:00",
    status: "available" as const,
  },
  {
    id: "2",
    date: "2025-04-11",
    startTime: "09:00",
    endTime: "17:00",
    status: "available" as const,
  },
  {
    id: "3",
    date: "2025-04-12",
    startTime: "10:00",
    endTime: "15:00",
    status: "booked" as const,
    shootTitle: "Johnson Property Shoot",
  },
  {
    id: "4",
    date: "2025-04-15",
    startTime: "13:00",
    endTime: "18:00",
    status: "available" as const,
  },
];

type AvailabilityStatus = "available" | "booked" | "unavailable";

interface Availability {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  startTime: string; 
  endTime: string;
  status: AvailabilityStatus;
  shootTitle?: string;
}

export default function Availability() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availabilities, setAvailabilities] = useState<Availability[]>(initialAvailabilities);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAvailability, setNewAvailability] = useState<Partial<Availability>>({
    status: "available",
    startTime: "09:00",
    endTime: "17:00"
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAvailabilityId, setSelectedAvailabilityId] = useState<string | null>(null);
  const { toast } = useToast();

  // Get availabilities for the selected date
  const getSelectedDateAvailabilities = () => {
    if (!date) return [];
    
    const dateString = format(date, "yyyy-MM-dd");
    return availabilities.filter(avail => avail.date === dateString);
  };

  const selectedDateAvailabilities = getSelectedDateAvailabilities();

  // Determine which dates have availabilities
  const availabilityDates = availabilities.map(avail => {
    if (isValid(new Date(avail.date))) {
      return new Date(avail.date);
    }
    return undefined;
  }).filter(Boolean) as Date[];

  // Handle adding a new availability
  const handleAddAvailability = () => {
    if (!date) return;
    
    const newAvail: Availability = {
      id: Date.now().toString(),
      date: format(date, "yyyy-MM-dd"),
      startTime: newAvailability.startTime || "09:00",
      endTime: newAvailability.endTime || "17:00",
      status: newAvailability.status || "available",
      shootTitle: newAvailability.status === "booked" ? newAvailability.shootTitle : undefined
    };
    
    setAvailabilities([...availabilities, newAvail]);
    setIsAddDialogOpen(false);
    setNewAvailability({
      status: "available",
      startTime: "09:00",
      endTime: "17:00"
    });
    
    toast({
      title: "Availability added",
      description: `Added availability for ${format(date, "MMMM d, yyyy")}`,
    });
  };

  // Handle deleting an availability
  const handleDeleteAvailability = () => {
    if (!selectedAvailabilityId) return;
    
    setAvailabilities(availabilities.filter(avail => avail.id !== selectedAvailabilityId));
    setIsDeleteDialogOpen(false);
    setSelectedAvailabilityId(null);
    
    toast({
      title: "Availability removed",
      description: "The availability slot has been removed.",
      variant: "destructive",
    });
  };

  // Custom day rendering to show availability indicators
  const renderDay = (day: Date) => {
    const dateString = format(day, "yyyy-MM-dd");
    const dayAvailabilities = availabilities.filter(avail => avail.date === dateString);
    
    const hasAvailable = dayAvailabilities.some(avail => avail.status === "available");
    const hasBooked = dayAvailabilities.some(avail => avail.status === "booked");
    
    return (
      <div className="relative h-full w-full">
        <div>{day.getDate()}</div>
        {dayAvailabilities.length > 0 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {hasAvailable && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
            {hasBooked && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="container px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Availability Management</h1>
          <p className="text-muted-foreground">Manage your availability for bookings</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Schedule</h2>
                <Button 
                  onClick={() => {
                    if (date) {
                      setNewAvailability({
                        ...newAvailability,
                      });
                      setIsAddDialogOpen(true);
                    } else {
                      toast({
                        title: "Select a date first",
                        description: "Please select a date before adding availability.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Availability
                </Button>
              </div>
              
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow p-3 pointer-events-auto"
                showOutsideDays={true}
                renderDay={renderDay}
                modifiersClassNames={{
                  selected: 'bg-primary text-primary-foreground',
                }}
              />
            </Card>
          </div>
          
          {/* Selected Date Availabilities */}
          <div>
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">
                {date ? format(date, "MMMM d, yyyy") : "Select a Date"}
              </h2>
              
              {selectedDateAvailabilities.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateAvailabilities.map((avail) => (
                    <Card key={avail.id} className="p-3 relative">
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          avail.status === 'available' ? 'bg-green-500' : 
                          avail.status === 'booked' ? 'bg-blue-500' : 'bg-gray-500'
                        }`}
                      >
                        {avail.status}
                      </Badge>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{avail.startTime} - {avail.endTime}</span>
                      </div>
                      
                      {avail.shootTitle && (
                        <div className="text-sm mt-2 font-medium">
                          {avail.shootTitle}
                        </div>
                      )}
                      
                      <div className="mt-3 flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            setSelectedAvailabilityId(avail.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <X className="h-4 w-4" /> Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {date ? (
                    <>
                      <p>No availability set for this date.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={() => {
                          setNewAvailability({
                            ...newAvailability,
                          });
                          setIsAddDialogOpen(true);
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Availability
                      </Button>
                    </>
                  ) : (
                    <p>Select a date to view or add availability.</p>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
        
        {/* Add Availability Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Availability</DialogTitle>
              <DialogDescription>
                Set your availability for {date ? format(date, "MMMM d, yyyy") : "the selected date"}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <Input 
                    type="time" 
                    value={newAvailability.startTime || ""}
                    onChange={e => setNewAvailability({...newAvailability, startTime: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <Input 
                    type="time" 
                    value={newAvailability.endTime || ""}
                    onChange={e => setNewAvailability({...newAvailability, endTime: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={newAvailability.status} 
                  onValueChange={(value) => 
                    setNewAvailability({
                      ...newAvailability, 
                      status: value as AvailabilityStatus
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {newAvailability.status === "booked" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shoot Title</label>
                  <Input 
                    placeholder="Enter shoot title or client name"
                    value={newAvailability.shootTitle || ""}
                    onChange={e => setNewAvailability({...newAvailability, shootTitle: e.target.value})}
                  />
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAvailability}>Add Availability</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Availability</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this availability slot? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteAvailability}>Remove</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
