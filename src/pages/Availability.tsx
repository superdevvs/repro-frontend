
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
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { PlusCircle, Clock, CalendarIcon, Trash2, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PhotographerAvailability } from "@/types/shoots";

const mockPhotographers = [
  { id: "1", name: "John Smith" },
  { id: "2", name: "Sarah Johnson" },
  { id: "3", name: "Michael Brown" },
  { id: "4", name: "Jessica Davis" },
];

const mockTimeSlots: PhotographerAvailability[] = [
  {
    id: "1",
    photographerId: "1",
    photographerName: "John Smith",
    date: new Date(2024, 4, 15),
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    id: "2",
    photographerId: "2",
    photographerName: "Sarah Johnson",
    date: new Date(2024, 4, 16),
    startTime: "13:00",
    endTime: "16:00",
  },
  {
    id: "3",
    photographerId: "3",
    photographerName: "Michael Brown",
    date: new Date(2024, 4, 18),
    startTime: "10:00",
    endTime: "15:00",
  },
  {
    id: "4",
    photographerId: "1",
    photographerName: "John Smith",
    date: new Date(2024, 4, 17),
    startTime: "14:00",
    endTime: "17:00",
  },
  {
    id: "5",
    photographerId: "4",
    photographerName: "Jessica Davis",
    date: new Date(2024, 4, 15),
    startTime: "10:00",
    endTime: "13:00",
  },
];

// Default working hours for photographers
const defaultWorkingHours = {
  "1": { // John Smith
    monday: { isWorking: true, start: "09:00", end: "17:00" },
    tuesday: { isWorking: true, start: "09:00", end: "17:00" },
    wednesday: { isWorking: true, start: "09:00", end: "17:00" },
    thursday: { isWorking: true, start: "09:00", end: "17:00" },
    friday: { isWorking: true, start: "09:00", end: "17:00" },
    saturday: { isWorking: false, start: "", end: "" },
    sunday: { isWorking: false, start: "", end: "" },
  },
  "2": { // Sarah Johnson
    monday: { isWorking: true, start: "10:00", end: "18:00" },
    tuesday: { isWorking: true, start: "10:00", end: "18:00" },
    wednesday: { isWorking: true, start: "10:00", end: "18:00" },
    thursday: { isWorking: true, start: "10:00", end: "18:00" },
    friday: { isWorking: true, start: "10:00", end: "18:00" },
    saturday: { isWorking: true, start: "12:00", end: "16:00" },
    sunday: { isWorking: false, start: "", end: "" },
  },
};

export default function Availability() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>("");
  const [isAddRangeOpen, setIsAddRangeOpen] = useState<boolean>(false);
  const [isEditWorkingHoursOpen, setIsEditWorkingHoursOpen] = useState<boolean>(false);
  const [newTimeSlot, setNewTimeSlot] = useState<Omit<PhotographerAvailability, 'id' | 'date' | 'photographerName'>>({
    photographerId: "",
    startTime: "09:00",
    endTime: "17:00",
  });

  // Filter time slots for selected date and photographer
  const filteredTimeSlots = mockTimeSlots.filter(slot => {
    const sameDate = selectedDate && 
      slot.date.getDate() === selectedDate.getDate() &&
      slot.date.getMonth() === selectedDate.getMonth() &&
      slot.date.getFullYear() === selectedDate.getFullYear();
    
    return sameDate && (!selectedPhotographer || slot.photographerId === selectedPhotographer);
  });

  const handleAddTimeRange = () => {
    // In a real app, this would call an API to save the new time slot
    console.log("New time range:", {
      date: selectedDate,
      ...newTimeSlot,
      photographerName: mockPhotographers.find(p => p.id === newTimeSlot.photographerId)?.name || "Unknown"
    });
    setIsAddRangeOpen(false);
  };

  const getPhotographerAvailabilityStatus = (photographerId: string, date?: Date) => {
    if (!date) return "unknown";
    
    // Get day of week
    const dayOfWeek = date.getDay();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day = days[dayOfWeek];
    
    // Check if photographer works on this day
    const photographerHours = defaultWorkingHours[photographerId as keyof typeof defaultWorkingHours];
    if (!photographerHours) return "unknown";
    
    const dayHours = photographerHours[day as keyof typeof photographerHours];
    if (!dayHours || !dayHours.isWorking) return "unavailable";
    
    // Check if there are any conflicting appointments
    const dateAppointments = mockTimeSlots.filter(slot => 
      slot.photographerId === photographerId &&
      slot.date.getDate() === date.getDate() &&
      slot.date.getMonth() === date.getMonth() &&
      slot.date.getFullYear() === date.getFullYear()
    );
    
    if (dateAppointments.length > 0) return "partially-booked";
    return "available";
  };

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Photographer Availability</h1>
              <p className="text-muted-foreground mt-1">
                Manage photographer schedules and appointments
              </p>
            </div>
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
                <CardTitle>Manage Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Select Photographer</Label>
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
                  </div>
                  
                  {selectedPhotographer && (
                    <div>
                      <div className="flex items-center justify-between">
                        <Label>Working Hours</Label>
                        <Button variant="ghost" size="sm" onClick={() => setIsEditWorkingHoursOpen(true)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="mt-2 text-sm">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Day</TableHead>
                              <TableHead>Hours</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {defaultWorkingHours[selectedPhotographer as keyof typeof defaultWorkingHours] ? (
                              Object.entries(defaultWorkingHours[selectedPhotographer as keyof typeof defaultWorkingHours]).map(([day, hours]) => (
                                <TableRow key={day}>
                                  <TableCell className="capitalize">{day}</TableCell>
                                  <TableCell>
                                    {hours.isWorking ? `${hours.start} - ${hours.end}` : 'Not Working'}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center">No working hours set</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                  
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
                      modifiers={{
                        booked: (date) => {
                          if (!selectedPhotographer) return false;
                          return getPhotographerAvailabilityStatus(selectedPhotographer, date) === "unavailable";
                        },
                        available: (date) => {
                          if (!selectedPhotographer) return false;
                          return getPhotographerAvailabilityStatus(selectedPhotographer, date) === "available";
                        },
                        partiallyBooked: (date) => {
                          if (!selectedPhotographer) return false;
                          return getPhotographerAvailabilityStatus(selectedPhotographer, date) === "partially-booked";
                        }
                      }}
                      modifiersClassNames={{
                        booked: "bg-red-100",
                        available: "bg-green-100",
                        partiallyBooked: "bg-yellow-100"
                      }}
                    />
                    {selectedPhotographer && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                          <span className="text-xs">Available</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
                          <span className="text-xs">Partially Booked</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-100 rounded-full"></div>
                          <span className="text-xs">Unavailable</span>
                        </div>
                      </div>
                    )}
                  </div>
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
                          <h4 className="font-medium">{slot.photographerName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {slot.startTime} - {slot.endTime}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

        {/* Edit Working Hours Dialog */}
        <Dialog open={isEditWorkingHoursOpen} onOpenChange={setIsEditWorkingHoursOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Working Hours</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                  <div key={day} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="capitalize">{day}</Label>
                      <Badge variant={defaultWorkingHours[selectedPhotographer as keyof typeof defaultWorkingHours]?.[day as keyof typeof defaultWorkingHours[keyof typeof defaultWorkingHours]]?.isWorking ? "default" : "outline"}>
                        {defaultWorkingHours[selectedPhotographer as keyof typeof defaultWorkingHours]?.[day as keyof typeof defaultWorkingHours[keyof typeof defaultWorkingHours]]?.isWorking ? "Working" : "Off"}
                      </Badge>
                    </div>
                    {defaultWorkingHours[selectedPhotographer as keyof typeof defaultWorkingHours]?.[day as keyof typeof defaultWorkingHours[keyof typeof defaultWorkingHours]]?.isWorking && (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`${day}-start`}>Start Time</Label>
                          <Input
                            id={`${day}-start`}
                            type="time"
                            value={defaultWorkingHours[selectedPhotographer as keyof typeof defaultWorkingHours]?.[day as keyof typeof defaultWorkingHours[keyof typeof defaultWorkingHours]]?.start || ""}
                            disabled={!selectedPhotographer}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${day}-end`}>End Time</Label>
                          <Input
                            id={`${day}-end`}
                            type="time"
                            value={defaultWorkingHours[selectedPhotographer as keyof typeof defaultWorkingHours]?.[day as keyof typeof defaultWorkingHours[keyof typeof defaultWorkingHours]]?.end || ""}
                            disabled={!selectedPhotographer}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditWorkingHoursOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsEditWorkingHoursOpen(false)}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
}
