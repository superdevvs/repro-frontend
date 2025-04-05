import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { ensureDate, ensureDateString, getTimeFromDate } from '@/utils/formatters';
import { PhotographerAvailability as PhotographerAvailabilityType } from '@/types/shoots';

interface AvailabilitySlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
}

interface RecurringSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

const PhotographerAvailability = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("daily");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availabilityData, setAvailabilityData] = useState<PhotographerAvailabilityType[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule[]>([
    { id: "1", dayOfWeek: 1, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "2", dayOfWeek: 2, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "3", dayOfWeek: 3, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "4", dayOfWeek: 4, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true },
    { id: "5", dayOfWeek: 5, startTime: "9:00 AM", endTime: "5:00 PM", isActive: true }
  ]);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSlotStartTime, setNewSlotStartTime] = useState<string>('');
  const [newSlotEndTime, setNewSlotEndTime] = useState<string>('');
  const [newSlotIsRecurring, setNewSlotIsRecurring] = useState(false);
  
  useEffect(() => {
    const slots = availabilityData.map(item => ({
      id: item.id || '',
      date: item.date || new Date(),
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      isRecurring: false
    }));
    setAvailabilitySlots(slots);
  }, [availabilityData]);
  
  const selectedDateSlots = availabilitySlots.filter(slot => 
    isSameDay(slot.date, selectedDate)
  );
  
  const getDayName = (dayIndex: number) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayIndex];
  };
  
  const hasAvailability = (date: Date) => {
    return availabilitySlots.some(slot => {
      const slotDate = typeof slot.date === 'string' ? parseISO(slot.date) : slot.date;
      return isSameDay(slotDate, date);
    });
  };
  
  const addAvailabilitySlot = () => {
    if (!newSlotStartTime || !newSlotEndTime) {
      toast({
        title: "Missing information",
        description: "Please select both start and end times.",
        variant: "destructive"
      });
      return;
    }
    
    const newSlot: AvailabilitySlot = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime: newSlotStartTime,
      endTime: newSlotEndTime,
      isRecurring: newSlotIsRecurring
    };
    
    setAvailabilitySlots([...availabilitySlots, newSlot]);
    
    const newAvailabilityItem: PhotographerAvailabilityType = {
      photographerId: "1",
      photographerName: "Current Photographer",
      id: newSlot.id,
      date: newSlot.date,
      startTime: newSlot.startTime, 
      endTime: newSlot.endTime,
      slots: [{
        date: newSlot.date.toISOString(),
        times: [newSlot.startTime]
      }]
    };
    
    setAvailabilityData([...availabilityData, newAvailabilityItem]);
    
    setNewSlotStartTime('');
    setNewSlotEndTime('');
    setAddDialogOpen(false);
    
    toast({
      title: "Availability added",
      description: `Added availability for ${format(selectedDate, 'EEEE, MMMM d')}`,
    });
    
    if (newSlotIsRecurring) {
      const dayOfWeek = selectedDate.getDay();
      
      const existingRecurring = recurringSchedule.find(rs => rs.dayOfWeek === dayOfWeek);
      
      if (existingRecurring) {
        setRecurringSchedule(
          recurringSchedule.map(rs => 
            rs.dayOfWeek === dayOfWeek
              ? { ...rs, startTime: newSlotStartTime || '', endTime: newSlotEndTime || '', isActive: true }
              : rs
          )
        );
      } else {
        setRecurringSchedule([
          ...recurringSchedule,
          {
            id: Date.now().toString(),
            dayOfWeek,
            startTime: newSlotStartTime || '9:00 AM',
            endTime: newSlotEndTime || '5:00 PM',
            isActive: true
          }
        ]);
      }
    }
  };
  
  const deleteAvailabilitySlot = (slotId: string) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== slotId));
    setAvailabilityData(availabilityData.filter(item => item.id !== slotId));
    
    toast({
      title: "Availability removed",
      description: "The availability slot has been removed from your schedule.",
    });
  };
  
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
                      today: (date) => isSameDay(date),
                    }}
                    modifiersClassNames={{
                      has_availability: "border-primary border-2",
                      today: "text-primary font-bold",
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle>
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>
                      {isSameDay(selectedDate, new Date()) ? "Today's" : "Selected day's"} availability slots
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
                    .sort((a, b) => {
                      const dateA = ensureDate(a.date);
                      const dateB = ensureDate(b.date);
                      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
                    })
                    .map((slot) => (
                      <div 
                        key={slot.id}
                        className="p-3 border rounded-md"
                      >
                        <div className="flex justify-between mb-2">
                          <p className="font-medium">{format(slot.date, 'EEEE, MMM d')}</p>
                          {isSameDay(slot.date, new Date()) && (
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
                  onChange={(time) => setNewSlotStartTime(time)}
                  placeholder="Select start time"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>End Time</Label>
                <TimeSelect
                  value={newSlotEndTime}
                  onChange={(time) => setNewSlotEndTime(time)}
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
