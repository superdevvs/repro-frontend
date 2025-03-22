
import { useState, useEffect } from "react";
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
import { 
  PlusCircle, 
  Clock, 
  CalendarIcon, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TimeSelect } from "@/components/ui/time-select";
import { PhotographerAvailability } from "@/types/shoots";
import { format, addDays, isSameDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
  "3": { // Michael Brown
    monday: { isWorking: true, start: "08:00", end: "16:00" },
    tuesday: { isWorking: true, start: "08:00", end: "16:00" },
    wednesday: { isWorking: true, start: "08:00", end: "16:00" },
    thursday: { isWorking: true, start: "08:00", end: "16:00" },
    friday: { isWorking: true, start: "08:00", end: "16:00" },
    saturday: { isWorking: false, start: "", end: "" },
    sunday: { isWorking: false, start: "", end: "" },
  },
  "4": { // Jessica Davis
    monday: { isWorking: true, start: "11:00", end: "19:00" },
    tuesday: { isWorking: true, start: "11:00", end: "19:00" },
    wednesday: { isWorking: true, start: "11:00", end: "19:00" },
    thursday: { isWorking: true, start: "11:00", end: "19:00" },
    friday: { isWorking: true, start: "11:00", end: "19:00" },
    saturday: { isWorking: true, start: "10:00", end: "14:00" },
    sunday: { isWorking: false, start: "", end: "" },
  },
};

export default function Availability() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>("");
  const [isAddRangeOpen, setIsAddRangeOpen] = useState<boolean>(false);
  const [isEditWorkingHoursOpen, setIsEditWorkingHoursOpen] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState<PhotographerAvailability[]>(mockTimeSlots);
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [newTimeSlot, setNewTimeSlot] = useState<Omit<PhotographerAvailability, 'id' | 'date' | 'photographerName'>>({
    photographerId: "",
    startTime: "09:00",
    endTime: "17:00",
  });
  const [isTimeSlotFormValid, setIsTimeSlotFormValid] = useState<boolean>(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<PhotographerAvailability | null>(null);
  const [isEditRangeOpen, setIsEditRangeOpen] = useState<boolean>(false);

  // Validate time slot form
  useEffect(() => {
    const isValid = 
      newTimeSlot.photographerId !== "" && 
      newTimeSlot.startTime !== "" && 
      newTimeSlot.endTime !== "" &&
      selectedDate !== undefined &&
      newTimeSlot.startTime < newTimeSlot.endTime;
    
    setIsTimeSlotFormValid(isValid);
  }, [newTimeSlot, selectedDate]);

  // Update new time slot when photographer is selected
  useEffect(() => {
    if (selectedPhotographer) {
      setNewTimeSlot(prev => ({
        ...prev,
        photographerId: selectedPhotographer
      }));
    }
  }, [selectedPhotographer]);

  // Filter time slots for selected date and photographer
  const filteredTimeSlots = timeSlots.filter(slot => {
    const sameDate = selectedDate && 
      isSameDay(slot.date, selectedDate);
    
    return sameDate && (!selectedPhotographer || slot.photographerId === selectedPhotographer);
  });

  const handleAddTimeRange = () => {
    if (!isTimeSlotFormValid || !selectedDate) return;

    const photographerName = mockPhotographers.find(p => p.id === newTimeSlot.photographerId)?.name || "Unknown";
    
    const newSlot: PhotographerAvailability = {
      id: `time-${Date.now()}`,
      photographerId: newTimeSlot.photographerId,
      photographerName,
      date: selectedDate,
      startTime: newTimeSlot.startTime,
      endTime: newTimeSlot.endTime,
    };
    
    setTimeSlots(prev => [...prev, newSlot]);
    setIsAddRangeOpen(false);
    
    toast({
      title: "Time Range Added",
      description: `${photographerName} is now available on ${format(selectedDate, 'MMM dd, yyyy')} from ${newTimeSlot.startTime} to ${newTimeSlot.endTime}`,
    });
  };
  
  const handleEditTimeRange = () => {
    if (!editingTimeSlot || !selectedDate) return;
    
    setTimeSlots(prev => prev.map(slot => 
      slot.id === editingTimeSlot.id ? editingTimeSlot : slot
    ));
    
    setIsEditRangeOpen(false);
    setEditingTimeSlot(null);
    
    toast({
      title: "Time Range Updated",
      description: `${editingTimeSlot.photographerName}'s availability has been updated`,
    });
  };
  
  const handleDeleteTimeRange = (id: string) => {
    const slotToDelete = timeSlots.find(slot => slot.id === id);
    
    if (!slotToDelete) return;
    
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
    
    toast({
      title: "Time Range Removed",
      description: `${slotToDelete.photographerName}'s availability on ${format(slotToDelete.date, 'MMM dd, yyyy')} has been removed`,
      variant: "destructive"
    });
  };

  // Update working hours after edit
  const handleUpdateWorkingHours = () => {
    setIsEditWorkingHoursOpen(false);
    
    toast({
      title: "Working Hours Updated",
      description: `Working hours have been updated successfully`,
    });
  };

  const getPhotographerAvailabilityStatus = (photographerId: string, date?: Date) => {
    if (!date) return "unknown";
    
    // Get day of week
    const dayOfWeek = date.getDay();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day = days[dayOfWeek];
    
    // Check if photographer works on this day
    const photographerHours = workingHours[photographerId as keyof typeof workingHours];
    if (!photographerHours) return "unknown";
    
    const dayHours = photographerHours[day as keyof typeof photographerHours];
    if (!dayHours || !dayHours.isWorking) return "unavailable";
    
    // Check if there are any existing appointments
    const dateAppointments = timeSlots.filter(slot => 
      slot.photographerId === photographerId &&
      isSameDay(slot.date, date)
    );
    
    if (dateAppointments.length > 0) return "partially-booked";
    return "available";
  };

  // Prepare calendar day modifiers
  const getCalendarModifiers = () => {
    if (!selectedPhotographer) return {};
    
    const today = new Date();
    const modifiers = {
      booked: [] as Date[],
      available: [] as Date[],
      partiallyBooked: [] as Date[]
    };
    
    // Add 60 days of statuses
    for (let i = 0; i < 60; i++) {
      const date = addDays(today, i);
      const status = getPhotographerAvailabilityStatus(selectedPhotographer, date);
      
      if (status === "unavailable") {
        modifiers.booked.push(date);
      } else if (status === "available") {
        modifiers.available.push(date);
      } else if (status === "partially-booked") {
        modifiers.partiallyBooked.push(date);
      }
    }
    
    return modifiers;
  };
  
  const calendarModifiers = getCalendarModifiers();

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
                  <div className="grid gap-2">
                    <Label>Date</Label>
                    <div className="border rounded-md p-2 bg-background">
                      {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'No date selected'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select a date on the calendar before adding a time range
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <TimeSelect
                        value={newTimeSlot.startTime}
                        onChange={(time) => setNewTimeSlot({...newTimeSlot, startTime: time})}
                        startHour={7}
                        endHour={21}
                        interval={30}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <TimeSelect
                        value={newTimeSlot.endTime}
                        onChange={(time) => setNewTimeSlot({...newTimeSlot, endTime: time})}
                        startHour={7}
                        endHour={21}
                        interval={30}
                      />
                    </div>
                  </div>
                  {newTimeSlot.startTime >= newTimeSlot.endTime && (
                    <div className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      End time must be after start time
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRangeOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleAddTimeRange}
                    disabled={!isTimeSlotFormValid}
                  >
                    Add Range
                  </Button>
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
                              <TableHead className="w-[80px]">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {workingHours[selectedPhotographer as keyof typeof workingHours] ? (
                              Object.entries(workingHours[selectedPhotographer as keyof typeof workingHours]).map(([day, hours]) => (
                                <TableRow key={day}>
                                  <TableCell className="capitalize">{day}</TableCell>
                                  <TableCell>
                                    {hours.isWorking ? `${hours.start} - ${hours.end}` : 'Not Working'}
                                  </TableCell>
                                  <TableCell>
                                    {hours.isWorking ? (
                                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        On
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Off
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} className="text-center">No working hours set</TableCell>
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
                      className="rounded-md border pointer-events-auto"
                      modifiers={{
                        booked: calendarModifiers.booked || [],
                        available: calendarModifiers.available || [],
                        partiallyBooked: calendarModifiers.partiallyBooked || []
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
                    ? `Availability for ${format(selectedDate, 'EEEE, MMMM dd, yyyy')}`
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
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingTimeSlot(slot);
                              setIsEditRangeOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleDeleteTimeRange(slot.id)}
                          >
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
                    {selectedDate && selectedPhotographer && (
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setIsAddRangeOpen(true)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Time Slot
                      </Button>
                    )}
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
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
                  const dayHours = workingHours[selectedPhotographer as keyof typeof workingHours]?.[day as keyof typeof workingHours[keyof typeof workingHours]];
                  return (
                    <div key={day} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="capitalize">{day}</Label>
                        <Badge 
                          variant="outline" 
                          className={dayHours?.isWorking 
                            ? "bg-green-500/10 text-green-600 border-green-200 cursor-pointer" 
                            : "bg-red-500/10 text-red-600 border-red-200 cursor-pointer"}
                          onClick={() => {
                            if (selectedPhotographer) {
                              const newWorkingHours = {...workingHours};
                              const photographer = newWorkingHours[selectedPhotographer as keyof typeof newWorkingHours];
                              if (photographer && day in photographer) {
                                const updatedDay = {...photographer[day as keyof typeof photographer]};
                                updatedDay.isWorking = !updatedDay.isWorking;
                                
                                if (updatedDay.isWorking && !updatedDay.start) {
                                  updatedDay.start = "09:00";
                                  updatedDay.end = "17:00";
                                }
                                
                                photographer[day as keyof typeof photographer] = updatedDay;
                                setWorkingHours(newWorkingHours);
                              }
                            }
                          }}
                        >
                          {dayHours?.isWorking ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Working
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Off
                            </>
                          )}
                        </Badge>
                      </div>
                      {dayHours?.isWorking && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`${day}-start`}>Start Time</Label>
                            <TimeSelect
                              value={dayHours.start}
                              onChange={(time) => {
                                if (selectedPhotographer) {
                                  const newWorkingHours = {...workingHours};
                                  const photographer = newWorkingHours[selectedPhotographer as keyof typeof newWorkingHours];
                                  if (photographer && day in photographer) {
                                    const updatedDay = {...photographer[day as keyof typeof photographer]};
                                    updatedDay.start = time;
                                    photographer[day as keyof typeof photographer] = updatedDay;
                                    setWorkingHours(newWorkingHours);
                                  }
                                }
                              }}
                              startHour={7}
                              endHour={21}
                              interval={30}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`${day}-end`}>End Time</Label>
                            <TimeSelect
                              value={dayHours.end}
                              onChange={(time) => {
                                if (selectedPhotographer) {
                                  const newWorkingHours = {...workingHours};
                                  const photographer = newWorkingHours[selectedPhotographer as keyof typeof newWorkingHours];
                                  if (photographer && day in photographer) {
                                    const updatedDay = {...photographer[day as keyof typeof photographer]};
                                    updatedDay.end = time;
                                    photographer[day as keyof typeof photographer] = updatedDay;
                                    setWorkingHours(newWorkingHours);
                                  }
                                }
                              }}
                              startHour={7}
                              endHour={21}
                              interval={30}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditWorkingHoursOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateWorkingHours}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Time Range Dialog */}
        <Dialog open={isEditRangeOpen} onOpenChange={setIsEditRangeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Time Range</DialogTitle>
            </DialogHeader>
            {editingTimeSlot && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Photographer</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {editingTimeSlot.photographerName}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <div className="p-2 border rounded-md bg-muted/30">
                    {format(editingTimeSlot.date, 'MMMM dd, yyyy')}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Time</Label>
                    <TimeSelect
                      value={editingTimeSlot.startTime}
                      onChange={(time) => setEditingTimeSlot({
                        ...editingTimeSlot,
                        startTime: time
                      })}
                      startHour={7}
                      endHour={21}
                      interval={30}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Time</Label>
                    <TimeSelect
                      value={editingTimeSlot.endTime}
                      onChange={(time) => setEditingTimeSlot({
                        ...editingTimeSlot,
                        endTime: time
                      })}
                      startHour={7}
                      endHour={21}
                      interval={30}
                    />
                  </div>
                </div>
                {editingTimeSlot.startTime >= editingTimeSlot.endTime && (
                  <div className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    End time must be after start time
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditRangeOpen(false);
                setEditingTimeSlot(null);
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleEditTimeRange}
                disabled={!editingTimeSlot || editingTimeSlot.startTime >= editingTimeSlot.endTime}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </DashboardLayout>
  );
}
