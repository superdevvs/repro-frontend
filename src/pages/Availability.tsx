
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format, parse, isValid, parseISO } from "date-fns";
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
import { CalendarIcon, Clock, Plus, X, User, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample photographers data
const samplePhotographers = [
  {
    id: "1",
    name: "John Smith",
    avatar: "/placeholder.svg",
  },
  {
    id: "2", 
    name: "Sarah Wilson",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Michael Brown",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "/placeholder.svg",
  },
  {
    id: "5",
    name: "David Johnson",
    avatar: "/placeholder.svg",
  }
];

// Sample availability periods
const initialAvailabilities = [
  {
    id: "1",
    photographerId: "1",
    date: "2025-04-10",
    startTime: "09:00",
    endTime: "17:00",
    status: "available" as const,
  },
  {
    id: "2",
    photographerId: "1",
    date: "2025-04-11",
    startTime: "09:00",
    endTime: "17:00",
    status: "available" as const,
  },
  {
    id: "3",
    photographerId: "2",
    date: "2025-04-12",
    startTime: "10:00",
    endTime: "15:00",
    status: "booked" as const,
    shootTitle: "Johnson Property Shoot",
  },
  {
    id: "4",
    photographerId: "2",
    date: "2025-04-15",
    startTime: "13:00",
    endTime: "18:00",
    status: "available" as const,
  },
  {
    id: "5",
    photographerId: "3",
    date: "2025-04-10",
    startTime: "08:00",
    endTime: "16:00",
    status: "available" as const,
  },
  {
    id: "6",
    photographerId: "4",
    date: "2025-04-09",
    startTime: "10:00",
    endTime: "18:00",
    status: "booked" as const,
    shootTitle: "Smith Residence Shoot",
  },
  {
    id: "7",
    photographerId: "5",
    date: "2025-04-12",
    startTime: "09:30",
    endTime: "15:30",
    status: "available" as const,
  },
  {
    id: "8",
    photographerId: "1",
    date: "2025-04-14",
    startTime: "09:00",
    endTime: "12:00",
    status: "unavailable" as const,
  },
  {
    id: "9",
    photographerId: "3",
    date: "2025-04-15",
    startTime: "09:00",
    endTime: "12:00",
    status: "partially_available" as const,
  }
];

type AvailabilityStatus = "available" | "booked" | "unavailable" | "partially_available";

interface Availability {
  id: string;
  photographerId: string;
  date: string; // ISO format: YYYY-MM-DD
  startTime: string; 
  endTime: string;
  status: AvailabilityStatus;
  shootTitle?: string;
}

interface WeeklySchedule {
  day: number;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
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
  const [selectedPhotographer, setSelectedPhotographer] = useState<string>("all");
  const { toast } = useToast();
  const [weeklySchedule, setWeeklySchedule] = useState<Record<number, WeeklySchedule>>({
    0: { day: 0, isAvailable: false, startTime: "09:00", endTime: "17:00" },
    1: { day: 1, isAvailable: true, startTime: "09:00", endTime: "17:00" },
    2: { day: 2, isAvailable: true, startTime: "09:00", endTime: "17:00" },
    3: { day: 3, isAvailable: true, startTime: "09:00", endTime: "17:00" },
    4: { day: 4, isAvailable: true, startTime: "09:00", endTime: "17:00" },
    5: { day: 5, isAvailable: true, startTime: "09:00", endTime: "17:00" },
    6: { day: 6, isAvailable: false, startTime: "09:00", endTime: "17:00" },
  });
  const [editingDay, setEditingDay] = useState<number | null>(null);

  // Get availabilities for the selected date and photographer
  const getSelectedDateAvailabilities = () => {
    if (!date) return [];
    
    const dateString = format(date, "yyyy-MM-dd");
    return availabilities.filter(avail => 
      avail.date === dateString && 
      (selectedPhotographer === "all" || avail.photographerId === selectedPhotographer));
  };

  const selectedDateAvailabilities = getSelectedDateAvailabilities();

  // Handle adding a new availability
  const handleAddAvailability = () => {
    if (!date || selectedPhotographer === "all") {
      toast({
        title: "Missing information",
        description: "Please select a specific photographer and date before adding availability.",
        variant: "destructive"
      });
      return;
    }
    
    const newAvail: Availability = {
      id: Date.now().toString(),
      photographerId: selectedPhotographer,
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

  // Function to determine if a date has availability based on selected photographer and status
  const getAvailabilityIndicator = (day: Date) => {
    // Ensure day is a valid Date object
    if (!day || !isValid(day)) {
      return { hasAvailable: false, hasBooked: false, hasUnavailable: false, hasPartiallyAvailable: false };
    }
    
    try {
      const dateString = format(day, "yyyy-MM-dd");
      const dayAvailabilities = availabilities.filter(
        avail => avail.date === dateString && 
          (selectedPhotographer === "all" || avail.photographerId === selectedPhotographer)
      );
      
      const hasAvailable = dayAvailabilities.some(avail => avail.status === "available");
      const hasBooked = dayAvailabilities.some(avail => avail.status === "booked");
      const hasUnavailable = dayAvailabilities.some(avail => avail.status === "unavailable");
      const hasPartiallyAvailable = dayAvailabilities.some(avail => avail.status === "partially_available");
      
      return { hasAvailable, hasBooked, hasUnavailable, hasPartiallyAvailable };
    } catch (error) {
      console.error("Error in getAvailabilityIndicator:", error, "Day:", day);
      return { hasAvailable: false, hasBooked: false, hasUnavailable: false, hasPartiallyAvailable: false };
    }
  };

  // Get photographer name by id
  const getPhotographerName = (id: string) => {
    const photographer = samplePhotographers.find(p => p.id === id);
    return photographer ? photographer.name : "Unknown";
  };

  // Toggle availability for a day in weekly schedule
  const toggleDayAvailability = (day: number) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable
      }
    }));
  };

  // Update time for a day in weekly schedule
  const updateDayTime = (day: number, field: 'startTime' | 'endTime', value: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  // Day content renderer for the calendar
  const renderDay = (day: Date) => {
    const { hasAvailable, hasBooked, hasUnavailable, hasPartiallyAvailable } = getAvailabilityIndicator(day);
    
    return (
      <div className="relative w-full h-full">
        <div>{day.getDate()}</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {hasAvailable && <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>}
          {hasBooked && <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>}
          {hasUnavailable && <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>}
          {hasPartiallyAvailable && <div className="h-1.5 w-1.5 rounded-full bg-yellow-500"></div>}
        </div>
      </div>
    );
  };

  // Get the color class based on availability status
  const getStatusColorClass = (status: AvailabilityStatus) => {
    switch (status) {
      case "available": return "bg-green-500";
      case "booked": return "bg-blue-500";
      case "unavailable": return "bg-red-500";
      case "partially_available": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Day names for weekly schedule
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <DashboardLayout>
      <div className="container px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Photographer Availability Management</h1>
          <p className="text-muted-foreground">Manage availability schedules for photographers</p>
        </div>
        
        <div className="mb-6">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Select Photographer:</span>
              </div>
              
              <Select 
                value={selectedPhotographer} 
                onValueChange={setSelectedPhotographer}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Select a photographer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Photographers</SelectItem>
                  {samplePhotographers.map(photographer => (
                    <SelectItem key={photographer.id} value={photographer.id}>
                      {photographer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
        
        {/* Calendar and Weekly Schedule in a single row */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
          {/* Calendar */}
          <Card className="lg:col-span-3 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {selectedPhotographer === "all" 
                  ? "All Photographers' Schedule" 
                  : `${getPhotographerName(selectedPhotographer)}'s Schedule`}
              </h2>
              <Button 
                onClick={() => {
                  if (date) {
                    if (selectedPhotographer === "all") {
                      toast({
                        title: "Select a photographer",
                        description: "Please select a specific photographer before adding availability.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setNewAvailability({
                      ...newAvailability,
                      photographerId: selectedPhotographer
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
              components={{
                Day: ({ date, ...props }) => {
                  if (!date) return null;
                  
                  const { hasAvailable, hasBooked, hasUnavailable, hasPartiallyAvailable } = 
                    getAvailabilityIndicator(date);
                   
                  let bgColorClass = "";
                  if (hasBooked) bgColorClass = "bg-blue-100 hover:bg-blue-200";
                  else if (hasAvailable) bgColorClass = "bg-green-100 hover:bg-green-200";
                  else if (hasUnavailable) bgColorClass = "bg-red-100 hover:bg-red-200";
                  else if (hasPartiallyAvailable) bgColorClass = "bg-yellow-100 hover:bg-yellow-200";
                  
                  return (
                    <button
                      type="button"
                      className={`${bgColorClass}`}
                      {...props}
                    >
                      {date.getDate()}
                    </button>
                  );
                },
              }}
            />
            
            {/* Availability Legend */}
            <div className="flex flex-wrap items-center gap-4 justify-center mt-4">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">Booked</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-muted-foreground">Chutti (Unavailable)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-muted-foreground">Partially Available</span>
              </div>
            </div>
          </Card>
          
          {/* Weekly Schedule */}
          <Card className="lg:col-span-4 p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedPhotographer === "all" 
                    ? "Weekly Schedule" 
                    : `${getPhotographerName(selectedPhotographer)}'s Weekly Schedule`}
                </h2>
                <p className="text-sm text-muted-foreground">Regular working hours</p>
              </div>
            </div>
            
            <div className="space-y-3">
              {dayNames.map((dayName, index) => (
                <div key={dayName} className={`p-3 border rounded-md ${index === editingDay ? 'border-primary' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center">
                      <Button
                        variant="ghost" 
                        size="sm"
                        className={`mr-2 ${weeklySchedule[index].isAvailable ? 'bg-green-100' : 'bg-red-100'}`}
                        onClick={() => toggleDayAvailability(index)}
                      >
                        {weeklySchedule[index].isAvailable ? 'Available' : 'Unavailable'}
                      </Button>
                      <span className="font-medium">{dayName}</span>
                    </div>
                    
                    {weeklySchedule[index].isAvailable && (
                      <div className="flex items-center gap-2">
                        {editingDay === index ? (
                          <>
                            <Input 
                              type="time" 
                              value={weeklySchedule[index].startTime} 
                              onChange={(e) => updateDayTime(index, 'startTime', e.target.value)}
                              className="w-24"
                            />
                            <span>to</span>
                            <Input 
                              type="time" 
                              value={weeklySchedule[index].endTime} 
                              onChange={(e) => updateDayTime(index, 'endTime', e.target.value)}
                              className="w-24"
                            />
                            <Button size="sm" onClick={() => setEditingDay(null)}>
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <span>{weeklySchedule[index].startTime} - {weeklySchedule[index].endTime}</span>
                            <Button variant="outline" size="sm" onClick={() => setEditingDay(index)}>
                              Edit
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Selected Date Availabilities */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {date ? format(date, "MMMM d, yyyy") : "Select a Date"}
            </h2>
          </div>
          
          {selectedDateAvailabilities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectedDateAvailabilities.map((avail) => (
                <Card key={avail.id} className="p-3 relative">
                  <Badge 
                    className={`absolute top-2 right-2 ${getStatusColorClass(avail.status)}`}
                  >
                    {avail.status.replace('_', ' ')}
                  </Badge>
                  
                  <div className="mt-1 font-medium">
                    {getPhotographerName(avail.photographerId)}
                  </div>
                  
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
                  {selectedPhotographer !== "all" && (
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => {
                        setNewAvailability({
                          ...newAvailability,
                          photographerId: selectedPhotographer
                        });
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Availability
                    </Button>
                  )}
                </>
              ) : (
                <p>Select a date to view or add availability.</p>
              )}
            </div>
          )}
        </Card>
        
        {/* Add Availability Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Availability</DialogTitle>
              <DialogDescription>
                Set availability for {selectedPhotographer !== "all" ? getPhotographerName(selectedPhotographer) : "photographer"} on {date ? format(date, "MMMM d, yyyy") : "the selected date"}.
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
                    <SelectItem value="unavailable">Unavailable (Chutti)</SelectItem>
                    <SelectItem value="partially_available">Partially Available</SelectItem>
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
