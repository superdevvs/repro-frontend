
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Clock, CalendarIcon } from "lucide-react";

const mockPhotographers = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Michael Brown" },
  { id: "4", name: "Jessica Davis" },
];

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  photographerId: string;
}

const mockTimeSlots: TimeSlot[] = [
  {
    id: "1",
    date: new Date(2024, 3, 15),
    startTime: "09:00",
    endTime: "12:00",
    photographerId: "1",
  },
  {
    id: "2",
    date: new Date(2024, 3, 16),
    startTime: "13:00",
    endTime: "16:00",
    photographerId: "2",
  },
  {
    id: "3",
    date: new Date(2024, 3, 18),
    startTime: "10:00",
    endTime: "15:00",
    photographerId: "3",
  },
];

export default function Availability() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>("");
  const [isAddRangeOpen, setIsAddRangeOpen] = useState<boolean>(false);
  const [newTimeSlot, setNewTimeSlot] = useState<Omit<TimeSlot, 'id' | 'date'>>({
    startTime: "09:00",
    endTime: "17:00",
    photographerId: "",
  });

  // Filter time slots for selected date and photographer
  const filteredTimeSlots = mockTimeSlots.filter(slot => {
    const sameDate = selectedDate && 
      slot.date.getDate() === selectedDate.getDate() &&
      slot.date.getMonth() === selectedDate.getMonth() &&
      slot.date.getFullYear() === selectedDate.getFullYear();
    
    return sameDate && (!selectedPhotographer || slot.photographerId === selectedPhotographer);
  });

  const getPhotographerNameById = (id: string) => {
    const photographer = mockPhotographers.find(p => p.id === id);
    return photographer ? photographer.name : "Unknown";
  };

  const handleAddTimeRange = () => {
    // In a real app, this would call an API to save the new time slot
    console.log("New time range:", {
      date: selectedDate,
      ...newTimeSlot
    });
    setIsAddRangeOpen(false);
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Photographer Availability</h1>
            <Dialog open={isAddRangeOpen} onOpenChange={setIsAddRangeOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Time Range
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Availability Time Range</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="photographer">Photographer</Label>
                    <Select 
                      value={newTimeSlot.photographerId} 
                      onValueChange={(value) => setNewTimeSlot({...newTimeSlot, photographerId: value})}
                    >
                      <SelectTrigger id="photographer">
                        <SelectValue placeholder="Select photographer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPhotographers.map(photographer => (
                          <SelectItem key={photographer.id} value={photographer.id}>
                            {photographer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        value={newTimeSlot.startTime}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, startTime: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input
                        id="end-time"
                        type="time"
                        value={newTimeSlot.endTime}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRangeOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddTimeRange}>Add Range</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Select Photographer</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedPhotographer} onValueChange={setSelectedPhotographer}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Photographers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Photographers</SelectItem>
                    {mockPhotographers.map(photographer => (
                      <SelectItem key={photographer.id} value={photographer.id}>
                        {photographer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Separator className="my-4" />
                
                <div>
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Select Date</h3>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedDate 
                    ? `Availability for ${selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                    : 'Please select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTimeSlots.length > 0 ? (
                  <div className="space-y-4">
                    {filteredTimeSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center p-3 border rounded-md bg-background">
                        <div className="mr-4 bg-primary/10 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{getPhotographerNameById(slot.photographerId)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Time Slots Available</h3>
                    <p className="text-muted-foreground mt-1">
                      {selectedDate ? 'There are no scheduled time slots for this date.' : 'Please select a date to view availability.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
