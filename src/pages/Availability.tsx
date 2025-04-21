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
import { 
  CalendarIcon, 
  Clock, 
  Plus, 
  X, 
  User, 
  ChevronDown, 
  AlertCircle, 
  Edit, 
  Save, 
  Calendar as CalendarIconOutlined,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/auth/AuthProvider";
import { TimeSelect } from "@/components/ui/time-select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
];

type AvailabilityStatus = "available" | "booked" | "unavailable";

interface Availability {
  id: string;
  photographerId: string;
  date: string; // ISO format: YYYY-MM-DD
  startTime: string; 
  endTime: string;
  status: AvailabilityStatus;
  shootTitle?: string;
}

interface WeeklyScheduleItem {
  day: string;
  active: boolean;
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
  const [editingWeeklySchedule, setEditingWeeklySchedule] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState<string | null>(null);
  const [editedAvailability, setEditedAvailability] = useState<Partial<Availability>>({});
  const [editModeOpen, setEditModeOpen] = useState(false);
  const { toast } = useToast();
  const { user, role } = useAuth();
  
  const [photographerWeeklySchedules, setPhotographerWeeklySchedules] = useState<Record<string, WeeklyScheduleItem[]>>({
    "1": [
      { day: 'Mon', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Tue', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Wed', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Thu', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Fri', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Sat', active: false, startTime: '10:00', endTime: '15:00' },
      { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
    ],
    "2": [
      { day: 'Mon', active: true, startTime: '8:00', endTime: '16:00' },
      { day: 'Tue', active: true, startTime: '8:00', endTime: '16:00' },
      { day: 'Wed', active: true, startTime: '8:00', endTime: '16:00' },
      { day: 'Thu', active: true, startTime: '8:00', endTime: '16:00' },
      { day: 'Fri', active: true, startTime: '8:00', endTime: '16:00' },
      { day: 'Sat', active: true, startTime: '10:00', endTime: '14:00' },
      { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
    ],
    "3": [
      { day: 'Mon', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Tue', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Wed', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Thu', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Fri', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Sat', active: false, startTime: '10:00', endTime: '15:00' },
      { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
    ],
    "4": [
      { day: 'Mon', active: true, startTime: '10:00', endTime: '18:00' },
      { day: 'Tue', active: true, startTime: '10:00', endTime: '18:00' },
      { day: 'Wed', active: true, startTime: '10:00', endTime: '18:00' },
      { day: 'Thu', active: true, startTime: '10:00', endTime: '18:00' },
      { day: 'Fri', active: true, startTime: '10:00', endTime: '18:00' },
      { day: 'Sat', active: false, startTime: '10:00', endTime: '15:00' },
      { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
    ],
    "5": [
      { day: 'Mon', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Tue', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Wed', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Thu', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Fri', active: true, startTime: '9:00', endTime: '17:00' },
      { day: 'Sat', active: false, startTime: '10:00', endTime: '15:00' },
      { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
    ],
  });

  const getCurrentWeeklySchedule = () => {
    if (selectedPhotographer === "all") {
      return [
        { day: 'Mon', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Tue', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Wed', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Thu', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Fri', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Sat', active: false, startTime: '10:00', endTime: '15:00' },
        { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
      ];
    }
    
    return photographerWeeklySchedules[selectedPhotographer] || [
      { day: 'Mon', active: false, startTime: '9:00', endTime: '17:00' },
      { day: 'Tue', active: false, startTime: '9:00', endTime: '17:00' },
      { day: 'Wed', active: false, startTime: '9:00', endTime: '17:00' },
      { day: 'Thu', active: false, startTime: '9:00', endTime: '17:00' },
      { day: 'Fri', active: false, startTime: '9:00', endTime: '17:00' },
      { day: 'Sat', active: false, startTime: '10:00', endTime: '15:00' },
      { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
    ];
  };

  const isAdmin = role === 'admin' || role === 'superadmin';

  const getSelectedDateAvailabilities = () => {
    if (!date) return [];
    
    const dateString = format(date, "yyyy-MM-dd");
    return availabilities.filter(avail => 
      avail.date === dateString && 
      (selectedPhotographer === "all" || avail.photographerId === selectedPhotographer));
  };

  const selectedDateAvailabilities = getSelectedDateAvailabilities();

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

  const getAvailabilityIndicator = (day: Date) => {
    const dateString = format(day, "yyyy-MM-dd");
    const dayAvailabilities = availabilities.filter(
      avail => avail.date === dateString &&
        (selectedPhotographer === "all" || avail.photographerId === selectedPhotographer)
    );

    const hasAvailable = dayAvailabilities.some(avail => avail.status === "available");
    const hasBooked = dayAvailabilities.some(avail => avail.status === "booked");
    const hasUnavailable = dayAvailabilities.some(avail => avail.status === "unavailable");

    return { hasAvailable, hasBooked, hasUnavailable };
  };

  const getPhotographerName = (id: string) => {
    const photographer = samplePhotographers.find(p => p.id === id);
    return photographer ? photographer.name : "Unknown";
  };

  const startEditingAvailability = (availId: string) => {
    const availToEdit = availabilities.find(a => a.id === availId);
    if (availToEdit) {
      setEditingAvailability(availId);
      setEditedAvailability({ ...availToEdit });
    }
  };

  const saveEditedAvailability = () => {
    if (!editingAvailability || !editedAvailability) return;
    
    setAvailabilities(prevAvails => 
      prevAvails.map(avail => 
        avail.id === editingAvailability
          ? { 
              ...avail, 
              startTime: editedAvailability.startTime || avail.startTime,
              endTime: editedAvailability.endTime || avail.endTime,
              status: editedAvailability.status || avail.status,
              shootTitle: editedAvailability.status === "booked" 
                ? editedAvailability.shootTitle || avail.shootTitle 
                : undefined
            }
          : avail
      )
    );
    
    setEditingAvailability(null);
    setEditedAvailability({});
    
    toast({
      title: "Availability updated",
      description: "The availability slot has been updated successfully."
    });
  };

  const saveWeeklySchedule = () => {
    if (selectedPhotographer === "all") {
      toast({
        title: "Select a photographer",
        description: "Please select a specific photographer before saving schedule.",
        variant: "destructive"
      });
      return;
    }
    
    const currentSchedule = getCurrentWeeklySchedule();
    
    setPhotographerWeeklySchedules(prev => ({
      ...prev,
      [selectedPhotographer]: currentSchedule
    }));
    
    setEditingWeeklySchedule(false);
    toast({
      title: "Schedule saved",
      description: `Weekly schedule for ${getPhotographerName(selectedPhotographer)} has been updated.`,
    });
  };

  const toggleEditMode = () => {
    if (editModeOpen) {
      setEditingAvailability(null);
      setEditingWeeklySchedule(false);
      setEditedAvailability({});
    }
    setEditModeOpen(!editModeOpen);
  };

  const canEditAvailability = isAdmin;
  
  const updateCurrentWeeklySchedule = (index: number, field: keyof WeeklyScheduleItem, value: any) => {
    if (selectedPhotographer === "all") return;
    
    const updatedSchedules = {...photographerWeeklySchedules};
    if (!updatedSchedules[selectedPhotographer]) {
      updatedSchedules[selectedPhotographer] = [
        { day: 'Mon', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Tue', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Wed', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Thu', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Fri', active: false, startTime: '9:00', endTime: '17:00' },
        { day: 'Sat', active: false, startTime: '10:00', endTime: '15:00' },
        { day: 'Sun', active: false, startTime: '10:00', endTime: '15:00' },
      ];
    }
    
    updatedSchedules[selectedPhotographer] = [
      ...updatedSchedules[selectedPhotographer].slice(0, index),
      {
        ...updatedSchedules[selectedPhotographer][index],
        [field]: value
      },
      ...updatedSchedules[selectedPhotographer].slice(index + 1)
    ];
    
    setPhotographerWeeklySchedules(updatedSchedules);
  };

  return (
    <DashboardLayout>
      <div className="container px-4 sm:px-6 py-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Photographer Availability Management</h1>
            <p className="text-muted-foreground">Manage availability schedules for photographers</p>
          </div>

          {canEditAvailability && (
            <Button
              variant={editModeOpen ? "default" : "primary"}
              onClick={toggleEditMode}
              className="gap-2 rounded-full px-6 py-2 shadow-md transition-all hover:scale-105 text-base"
            >
              {editModeOpen ? (
                <>Exit Edit Mode</>
              ) : (
                <>Edit Mode</>
              )}
            </Button>
          )}
        </div>

        {!canEditAvailability && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>You are in view-only mode. Only administrators can edit photographer availability.</p>
          </div>
        )}

        <div className="mb-6">
          <Card className="p-4 bg-gradient-to-br from-[#f1f0fb] to-[#e5deff] dark:from-[#221F26] dark:to-[#333] shadow-xl glass-morphism border-2 border-[#e5deff]/40 dark:border-[#222]/60">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Select Photographer:</span>
              </div>
              <Select 
                value={selectedPhotographer} 
                onValueChange={(value) => {
                  setSelectedPhotographer(value);
                  setEditingAvailability(null);
                  setEditedAvailability({});
                  setEditingWeeklySchedule(false);
                }}
              >
                <SelectTrigger className="w-full md:w-[250px] rounded-lg shadow-lg border-2 border-[#9b87f5]/20 dark:border-[#2d225a] focus:ring-2 focus:ring-primary/50 transition">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="p-4 h-full bg-gradient-to-br from-[#F1F0FB] to-[#E5DEFF] dark:from-[#1A1F2C] dark:to-[#222733] backdrop-blur-[2px] border-2 border-[#d6bcfa] dark:border-[#403E43] shadow-lg rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedPhotographer === "all" 
                    ? "All Photographers' Schedule" 
                    : `${getPhotographerName(selectedPhotographer)}'s Schedule`}
                </h2>
              </div>

              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-2xl border-none shadow transition ring-1 ring-[#e5deff]/60 dark:ring-[#403E43]/30 pointer-events-auto mx-auto w-full max-w-[400px] md:max-w-[80%] p-4 bg-[#fff]/60 dark:bg-[#1A1F2C]/70"
                showOutsideDays={true}
                modifiersClassNames={{
                  selected: 'bg-[#8B5CF6] text-white scale-110 font-bold shadow-lg border-2 border-[#9b87f5] dark:border-[#8B5CF6] rounded-xl',
                  today: 'bg-[#FEF7CD] dark:bg-[#222733] text-[#ab8bfa] font-bold ring-2 ring-[#8B5CF6]/30',
                }}
                components={{
                  Day: ({ date: dayDate }) => {
                    const { hasAvailable, hasBooked, hasUnavailable } = getAvailabilityIndicator(dayDate);

                    return (
                      <div className="relative py-1 w-full h-full flex flex-col items-center justify-center px-2 group transition">
                        <span className="inline-flex items-center justify-center w-8 h-8 text-base rounded-xl group-hover:bg-[#f3f0fa] dark:group-hover:bg-[#2d225a] transition">
                          {dayDate.getDate()}
                        </span>
                        {(hasAvailable || hasBooked || hasUnavailable) && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                            {hasAvailable && (
                              <span
                                className="rounded-full w-2.5 h-2.5 shadow-badge"
                                style={{
                                  background: '#98e89e',
                                  border: '2px solid #fff',
                                  boxShadow: '0 0 4px 1px #8ece94c0',
                                }}
                                title="Available"
                              />
                            )}
                            {hasBooked && (
                              <span
                                className="rounded-full w-2.5 h-2.5 shadow-badge"
                                style={{
                                  background: '#aad4fe',
                                  border: '2px solid #fff',
                                  boxShadow: '0 0 4px 1px #7baadac0',
                                }}
                                title="Booked"
                              />
                            )}
                            {hasUnavailable && (
                              <span
                                className="rounded-full w-2.5 h-2.5 shadow-badge"
                                style={{
                                  background: '#f89ba2',
                                  border: '2px solid #fff',
                                  boxShadow: '0 0 4px 1px #c86374b5',
                                }}
                                title="Unavailable"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  }
                }}
              />

              <div className="flex flex-wrap gap-4 justify-center items-center mt-5">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{
                    background: "#98e89e",
                    border: "2px solid #fff",
                    boxShadow: '0 0 4px 1px #8ece94c0'
                  }} />
                  <span className="text-xs font-medium text-green-800">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{
                    background: "#aad4fe",
                    border: "2px solid #fff",
                    boxShadow: '0 0 4px 1px #7baadac0'
                  }} />
                  <span className="text-xs font-medium text-blue-700">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{
                    background: "#f89ba2",
                    border: "2px solid #fff",
                    boxShadow: '0 0 4px 1px #c86374b5'
                  }} />
                  <span className="text-xs font-medium text-red-700">Unavailable</span>
                </div>
              </div>

              {canEditAvailability && editModeOpen && selectedPhotographer !== "all" && date && (
                <div className="mt-8">
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
                    className="w-full rounded-xl bg-[#9b87f5] hover:bg-[#8B5CF6] text-white font-semibold py-3 text-base shadow-md transition-all"
                  >
                    Add Availability
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-4">
            {selectedPhotographer !== "all" ? (
              <Card className="p-4 h-full">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {getPhotographerName(selectedPhotographer)}'s Weekly Schedule
                    </h2>
                    <p className="text-sm text-muted-foreground">Regular working hours</p>
                  </div>
                  
                  {canEditAvailability && editModeOpen && (
                    <Button 
                      variant={editingWeeklySchedule ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setEditingWeeklySchedule(!editingWeeklySchedule)}
                    >
                      {editingWeeklySchedule ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {getCurrentWeeklySchedule().map((day, index) => (
                    <div 
                      key={day.day} 
                      className={`border rounded-lg p-2 ${index > 4 ? 'bg-gray-50 dark:bg-gray-800/30' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">{day.day}</div>
                        
                        {editingWeeklySchedule ? (
                          <Switch 
                            checked={day.active}
                            onCheckedChange={(checked) => {
                              updateCurrentWeeklySchedule(index, 'active', checked);
                            }}
                          />
                        ) : (
                          <Badge className={`${day.active ? 'bg-green-500' : 'bg-gray-400'}`}>
                            {day.active ? 'Active' : 'Inactive'}
                          </Badge>
                        )}
                      </div>
                      
                      {editingWeeklySchedule && day.active ? (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <Label className="text-xs">Start</Label>
                            <TimeSelect 
                              value={day.startTime}
                              onChange={(time) => {
                                updateCurrentWeeklySchedule(index, 'startTime', time);
                              }}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">End</Label>
                            <TimeSelect 
                              value={day.endTime}
                              onChange={(time) => {
                                updateCurrentWeeklySchedule(index, 'endTime', time);
                              }}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm mt-1 text-muted-foreground">
                          {day.active ? `${day.startTime} - ${day.endTime}` : 'Not Available'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {editingWeeklySchedule && (
                  <Button 
                    className="w-full mt-4" 
                    onClick={saveWeeklySchedule}
                  >
                    <Save className="h-4 w-4 mr-2" /> 
                    Save Weekly Schedule
                  </Button>
                )}
              </Card>
            ) : (
              <Card className="p-4 h-full flex items-center justify-center">
                <div className="text-center">
                  <CalendarIconOutlined className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h2 className="text-lg font-semibold mb-2">Weekly Schedule</h2>
                  <p className="text-muted-foreground">
                    Select a specific photographer to view their weekly schedule
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {date ? format(date, "MMMM d, yyyy") : "Select a Date"}
              </h2>
              
              {canEditAvailability && editModeOpen && selectedPhotographer !== "all" && date && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setNewAvailability({
                      ...newAvailability,
                      photographerId: selectedPhotographer
                    });
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" /> 
                  Add Slot
                </Button>
              )}
            </div>
            
            {selectedDateAvailabilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {selectedDateAvailabilities.map((avail) => (
                  <div key={avail.id}>
                    {editingAvailability === avail.id ? (
                      <Card className="p-3">
                        <div className="space-y-3">
                          <div>
                            <Label>Status</Label>
                            <Select 
                              value={editedAvailability.status || avail.status}
                              onValueChange={(val) => 
                                setEditedAvailability({...editedAvailability, status: val as AvailabilityStatus})
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
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Start Time</Label>
                              <TimeSelect 
                                value={editedAvailability.startTime || avail.startTime}
                                onChange={(time) => 
                                  setEditedAvailability({...editedAvailability, startTime: time})
                                }
                              />
                            </div>
                            <div>
                              <Label>End Time</Label>
                              <TimeSelect 
                                value={editedAvailability.endTime || avail.endTime}
                                onChange={(time) => 
                                  setEditedAvailability({...editedAvailability, endTime: time})
                                }
                              />
                            </div>
                          </div>
                          
                          {(editedAvailability.status || avail.status) === "booked" && (
                            <div>
                              <Label>Shoot Title</Label>
                              <Input 
                                value={editedAvailability.shootTitle || avail.shootTitle || ""}
                                onChange={(e) => 
                                  setEditedAvailability({...editedAvailability, shootTitle: e.target.value})
                                }
                              />
                            </div>
                          )}
                          
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingAvailability(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm"
                              onClick={saveEditedAvailability}
                            >
                              <Save className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card 
                        className={`p-3 relative border-l-4 ${
                          avail.status === 'available' ? 'border-l-green-500' : 
                          avail.status === 'booked' ? 'border-l-blue-500' : 'border-l-red-500'
                        }`}
                      >
                        <Badge 
                          className={`absolute top-2 right-2 ${
                            avail.status === 'available' ? 'bg-green-500' : 
                            avail.status === 'booked' ? 'bg-blue-500' : 'bg-red-500'
                          }`}
                        >
                          {avail.status}
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
                        
                        {canEditAvailability && editModeOpen && (
                          <div className="mt-3 flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => startEditingAvailability(avail.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setSelectedAvailabilityId(avail.id);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {date ? (
                  <>
                    <p>No availability set for this date.</p>
                    {canEditAvailability && editModeOpen && selectedPhotographer !== "all" && (
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
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Availability</DialogTitle>
              <DialogDescription>
                Set availability for {getPhotographerName(selectedPhotographer)} on {date ? format(date, "MMMM d, yyyy") : "the selected date"}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
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
              
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <TimeSelect 
                      value={newAvailability.startTime || ""}
                      onChange={(time) => setNewAvailability({...newAvailability, startTime: time})}
                      placeholder="Select start time"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <TimeSelect 
                      value={newAvailability.endTime || ""}
                      onChange={(time) => setNewAvailability({...newAvailability, endTime: time})}
                      placeholder="Select end time"
                    />
                  </div>
                </div>
              
                {newAvailability.status === "booked" && (
                  <div className="space-y-2">
                    <Label>Shoot Title</Label>
                    <Input 
                      placeholder="Enter shoot title or client name"
                      value={newAvailability.shootTitle || ""}
                      onChange={e => setNewAvailability({...newAvailability, shootTitle: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAvailability}>Add Availability</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
