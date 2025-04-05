
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { TimeSelect } from '@/components/ui/time-select';
import { CalendarIcon, Clock, Plus, Trash } from 'lucide-react';
import { format, isSameDay, isToday } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

// Types
interface AvailabilitySlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
}

interface RecurringSchedule {
  id: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const PhotographerAvailability = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([
    {
      id: "1",
      date: new Date(),
      startTime: "9:00 AM",
      endTime: "12:00 PM"
    },
    {
      id: "2",
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      startTime: "1:00 PM",
      endTime: "5:00 PM"
    }
  ]);
  
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule[]>([
    { id: "1", dayOfWeek: 1, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "2", dayOfWeek: 2, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "3", dayOfWeek: 3, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "4", dayOfWeek: 4, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "5", dayOfWeek: 5, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true }
  ]);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSlotStartTime, setNewSlotStartTime] = useState<string>("");
  const [newSlotEndTime, setNewSlotEndTime] = useState<string>("");
  const [newSlotIsRecurring, setNewSlotIsRecurring] = useState(false);
  
  // Find availability slots for selected date
  const selectedDateSlots = availabilitySlots.filter(slot => 
    isSameDay(slot.date, selectedDate)
  );
  
  // Helper function to get day name
  const getDayName = (dayIndex: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
  };
  
  // Helper function to check if a date has availability
  const hasAvailability = (date: Date) => {
    return availabilitySlots.some(slot => isSameDay(slot.date, date));
  };
  
  // Add a new availability slot
  const addAvailabilitySlot = () => {
    if (!newSlotStartTime || !newSlotEndTime) {
      toast({
        title: "Missing information",
        description: "Please select both start and end times.",
        variant: "destructive"
      });
      return;
    }
    
    // Create new slot object
    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime: newSlotStartTime,
      endTime: newSlotEndTime,
      isRecurring: newSlotIsRecurring
    };
    
    // Add to state
    setAvailabilitySlots([...availabilitySlots, newSlot]);
    
    // Reset form and close dialog
    setNewSlotStartTime("");
    setNewSlotEndTime("");
    setAddDialogOpen(false);
    
    toast({
      title: "Availability added",
      description: `Added availability for ${format(selectedDate, 'EEEE, MMMM d')}`,
    });
    
    // If recurring, create a recurring schedule
    if (newSlotIsRecurring) {
      const dayOfWeek = selectedDate.getDay();
      
      // Check if already exists
      const existingRecurring = recurringSchedule.find(rs => rs.dayOfWeek === dayOfWeek);
      
      if (existingRecurring) {
        // Update existing
        setRecurringSchedule(
          recurringSchedule.map(rs => 
            rs.dayOfWeek === dayOfWeek
              ? { ...rs, startTime: newSlotStartTime, endTime: newSlotEndTime, isActive: true }
              : rs
          )
        );
      } else {
        // Create new
        setRecurringSchedule([
          ...recurringSchedule,
          {
            id: Date.now().toString(),
            dayOfWeek,
            startTime: newSlotStartTime,
            endTime: newSlotEndTime,
            isActive: true
          }
        ]);
      }
    }
  };
  
  // Delete an availability slot
  const deleteAvailabilitySlot = (slotId: string) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== slotId));
    
    toast({
      title: "Availability removed",
      description: "The availability slot has been removed from your schedule.",
    });
  };
  
  // Toggle recurring schedule
  const toggleRecurringDay = (dayId: string, active: boolean) => {
    setRecurringSchedule(
      recurringSchedule.map(day => 
        day.id === dayId ? { ...day, isActive: active } : day
      )
    );
    
    toast({
      title: active ? "Day activated" : "Day deactivated",
      description: `Recurring schedule has been updated.`,
    });
  };
  
  // Update recurring schedule time
  const updateRecurringTime = (dayId: string, field: 'startTime' | 'endTime', value: string) => {
    setRecurringSchedule(
      recurringSchedule.map(day => 
        day.id === dayId ? { ...day, [field]: value } : day
      )
    );
  };
  
  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Availability</h1>
            <p className="text-muted-foreground">Manage when you're available for photo shoots</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="daily" className="flex gap-2 items-center">
              <CalendarIcon className="h-4 w-4" />
              <span>Daily Availability</span>
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              <span>Recurring Schedule</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar picker */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>
                    Choose a date to set your availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="p-3 pointer-events-auto"
                    modifiers={{
                      has_availability: (date) => hasAvailability(date),
                      today: (date) => isToday(date),
                    }}
                    modifiersClassNames={{
                      has_availability: "border-primary border-2",
                      today: "text-primary font-bold",
                    }}
                  />
                </CardContent>
              </Card>
              
              {/* Availability slots for selected date */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>
                      {isToday(selectedDate) ? "Today's" : "Selected day's"} availability slots
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setAddDialogOpen(true)}
                    size="sm" 
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Slot
                  </Button>
                </CardHeader>
                
                <CardContent>
                  {selectedDateSlots.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateSlots.map((slot) => (
                        <div 
                          key={slot.id}
                          className="flex items-center justify-between border p-3 rounded-md"
                        >
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                            {slot.isRecurring && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Recurring
                              </Badge>
                            )}
                          </div>
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAvailabilitySlot(slot.id)}
                          >
                            <Trash className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-muted-foreground mb-4">No availability slots set for this date</p>
                      <Button onClick={() => setAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Availability
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Availability</CardTitle>
                <CardDescription>Overview of your scheduled availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availabilitySlots
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((slot) => (
                      <div 
                        key={slot.id}
                        className="p-3 border rounded-md"
                      >
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">{format(slot.date, 'EEEE, MMM d')}</p>
                          {isToday(slot.date) && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                              Today
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAvailabilitySlot(slot.id)}
                          >
                            <Trash className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recurring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Set your recurring availability for each day of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                    const day = recurringSchedule.find(d => d.dayOfWeek === dayIndex);
                    const isWeekend = dayIndex === 0 || dayIndex === 6;
                    
                    return (
                      <div key={dayIndex} className={`p-4 border rounded-md ${isWeekend ? 'bg-gray-50' : ''}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center min-w-[100px]">
                            <Switch
                              checked={day?.isActive || false}
                              onCheckedChange={(checked) => {
                                if (day) {
                                  toggleRecurringDay(day.id, checked);
                                } else {
                                  // Create default schedule for this day
                                  const newDay: RecurringSchedule = {
                                    id: Date.now().toString(),
                                    dayOfWeek: dayIndex,
                                    startTime: "9:00 AM",
                                    endTime: "5:00 PM",
                                    isActive: true
                                  };
                                  setRecurringSchedule([...recurringSchedule, newDay]);
                                }
                              }}
                              className="mr-3"
                            />
                            <Label className={`font-medium ${isWeekend ? 'text-orange-700' : ''}`}>
                              {getDayName(dayIndex)}
                            </Label>
                          </div>
                          
                          {(day?.isActive || false) ? (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                              <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <Label className="text-sm text-muted-foreground">Start Time</Label>
                                <TimeSelect
                                  value={day?.startTime}
                                  onChange={(time) => {
                                    if (day) updateRecurringTime(day.id, 'startTime', time);
                                  }}
                                  className="w-full"
                                />
                              </div>
                              
                              <div className="w-4 mt-6 text-center hidden sm:block">to</div>
                              
                              <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <Label className="text-sm text-muted-foreground">End Time</Label>
                                <TimeSelect
                                  value={day?.endTime}
                                  onChange={(time) => {
                                    if (day) updateRecurringTime(day.id, 'endTime', time);
                                  }}
                                  className="w-full"
                                />
                              </div>
                              
                              <div className="text-xs text-muted-foreground mt-1 sm:ml-4">
                                {day && (
                                  <span>
                                    {/* Calculate hours */}
                                    Available {day.startTime} - {day.endTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground italic ml-4">Not available</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6">
                  <Button className="w-full" onClick={() => {
                    toast({
                      title: "Schedule updated",
                      description: "Your recurring weekly schedule has been saved.",
                    });
                  }}>
                    Save Weekly Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Blackout Dates</CardTitle>
                <CardDescription>
                  Set dates when you're not available regardless of your weekly schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    Set dates when you'll be unavailable for shoots
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Blackout Date
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add new availability dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Availability</DialogTitle>
              <DialogDescription>
                Set your availability for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label>Start Time</Label>
                <TimeSelect
                  value={newSlotStartTime}
                  onChange={setNewSlotStartTime}
                  placeholder="Select start time"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>End Time</Label>
                <TimeSelect
                  value={newSlotEndTime}
                  onChange={setNewSlotEndTime}
                  placeholder="Select end time"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={newSlotIsRecurring}
                  onCheckedChange={setNewSlotIsRecurring}
                />
                <Label htmlFor="recurring">
                  Make this a recurring weekly slot
                </Label>
              </div>
              
              {newSlotIsRecurring && (
                <div className="text-sm text-muted-foreground">
                  This availability will be added to your recurring schedule for every {format(selectedDate, 'EEEE')}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addAvailabilitySlot}>
                Add Availability
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default PhotographerAvailability;
