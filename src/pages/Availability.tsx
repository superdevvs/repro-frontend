import React, { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { format, parse, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import API_ROUTES from "@/lib/api";

type Photographer = { id: string; name: string };

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

  origin?: 'specific' | 'weekly';

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
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [backendSlots, setBackendSlots] = useState<Array<{ id:number; photographer_id:number; date?: string|null; day_of_week?: string|null; start_time:string; end_time:string; status?: string }>>([]);
  const [allBackendSlots, setAllBackendSlots] = useState<Array<{ id:number; photographer_id:number; date?: string|null; day_of_week?: string|null; start_time:string; end_time:string; status?: string }>>([]);
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

  const authHeaders = () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  const uiTimeToHhmm = (t?: string): string => {
    if (!t) return "";
    if (/^\d{1,2}:\d{2}$/.test(t)) {
      const [h, m] = t.split(":");
      return `${String(parseInt(h,10)).padStart(2,'0')}:${m}`;
    }
    const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return t;
    let hh = parseInt(m[1], 10);
    const mm = m[2];
    const mer = m[3].toUpperCase();
    if (mer === 'PM' && hh !== 12) hh += 12;
    if (mer === 'AM' && hh === 12) hh = 0;
    return `${String(hh).padStart(2,'0')}:${mm}`;
  };

  const refreshPhotographerSlots = async () => {
    try {
      if (selectedPhotographer === 'all') {
        if (!photographers || photographers.length === 0) { setAllBackendSlots([]); return; }
        const results = await Promise.all(
          photographers.map(async (p) => {
            try {
              const r = await fetch(API_ROUTES.photographerAvailability.list(p.id));
              if (!r.ok) return [] as any[];
              const j = await r.json();
              return (j?.data || []).map((row:any) => ({ ...row, photographer_id: Number(p.id) }));
            } catch { return [] as any[]; }
          })
        );
        const merged:any[] = ([] as any[]).concat(...results);
        setAllBackendSlots(merged);
        setBackendSlots([]);
        return;
      }
      const r = await fetch(API_ROUTES.photographerAvailability.list(selectedPhotographer));
      if (!r.ok) { setBackendSlots([]); setAllBackendSlots([]); return; }
      const j = await r.json();
      setBackendSlots(j?.data || []);
      setAllBackendSlots([]);
    } catch {
      setBackendSlots([]); setAllBackendSlots([]);
    }
  };

  const { user, role } = useAuth();


  // Load photographers (public endpoint, fallback to admin)
  useEffect(() => {
    const publicUrl = (API_ROUTES as any)?.people?.photographers || `${import.meta.env.VITE_API_URL || ""}/api/photographers`;
    fetch(publicUrl)
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then(json => {
        const list = (json?.data || json || []).map((u: any) => ({ id: String(u.id), name: u.name || u.email || `User ${u.id}` }));
        setPhotographers(list);
      })
      .catch(() => {
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        if (!token) return;
        const adminUrl = (API_ROUTES as any)?.people?.adminPhotographers || `${import.meta.env.VITE_API_URL || ""}/api/admin/photographers`;
        fetch(adminUrl, { headers: { Authorization: `Bearer ${token}` } })
          .then(r => (r.ok ? r.json() : Promise.reject(r)))
          .then(json => {
            const list = (json?.data || json?.users || json || []).map((u: any) => ({ id: String(u.id), name: u.name || u.full_name || u.email || `User ${u.id}` }));
            setPhotographers(list);
          })
          .catch(() => {});
      });
  }, []);



  // Load photographers for dropdown

    useEffect(() => {

    if (!selectedPhotographer) { setBackendSlots([]); setAllBackendSlots([]); return; }

    if (selectedPhotographer === 'all') {

      if (!photographers || photographers.length === 0) { setAllBackendSlots([]); return; }

      Promise.all(

        photographers.map(p =>

          fetch(API_ROUTES.photographerAvailability.list(p.id))

            .then(r => (r.ok ? r.json() : Promise.reject(r)))

            .then(json => (json?.data || []).map((row:any) => ({ ...row, photographer_id: Number(p.id) })))

            .catch(() => [])

        )

      ).then(results => {
        const merged = ([] as any[]).concat(...results);
        setAllBackendSlots(merged as any);
        setBackendSlots([]);
      });
      return;
    }
    fetch(API_ROUTES.photographerAvailability.list(selectedPhotographer))
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(json => { setBackendSlots(json?.data || []); setAllBackendSlots([]); })
      .catch(() => { setBackendSlots([]); setAllBackendSlots([]); });
  }, [selectedPhotographer, photographers]);



  const dateStr = useMemo(() => date ? format(date, 'yyyy-MM-dd') : undefined, [date]);

  const dayOfWeek = useMemo(() => date ? date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() : undefined, [date]);

  const toHhMm = (t?: string) => t ? t.slice(0,5) : '';



  

  

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



   // If logged-in user is a photographer, auto-select them on first render (only if selection is still "all")

  useEffect(() => {

    if (role === 'photographer' && user && selectedPhotographer === "all") {

      // assume user.id corresponds to photographer id string (adjust if your auth shape differs)

      setSelectedPhotographer(String(user.id));

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [role, user]);



  // Admins/superadmins can edit everything

  const isAdmin = role === 'admin' || role === 'superadmin';



  // Photographers can edit only their own schedule (when they select themselves)

  const isPhotographer = role === 'photographer';



  const getSelectedDateAvailabilities = (): Availability[] => {

    if (!dateStr || !selectedPhotographer) return [];

    

    const rows = selectedPhotographer === 'all' ? allBackendSlots : backendSlots.filter(s => Number(s.photographer_id) === Number(selectedPhotographer));

    const specific = rows.filter(s => s.date === dateStr);

    const isSpecific = specific.length > 0;

    const base = isSpecific ? specific : rows.filter(s => !s.date && s.day_of_week === dayOfWeek);

    return base.map((s, idx): Availability => ({

      id: String(s.id ?? idx),

      photographerId: String(s.photographer_id),

      date: dateStr,

      startTime: toHhMm(s.start_time),

      endTime: toHhMm(s.end_time),

      status: (s.status === 'unavailable' ? 'unavailable' : 'available') as AvailabilityStatus,

      origin: isSpecific ? 'specific' : 'weekly'

    }));

  };



  const selectedDateAvailabilities = getSelectedDateAvailabilities();



  const handleAddAvailability = async () => {

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

    // Persist to backend
    try {
      const payload = {
        photographer_id: Number(selectedPhotographer),
        date: format(date, "yyyy-MM-dd"),
        start_time: uiTimeToHhmm(newAvailability.startTime || "09:00"),
        end_time: uiTimeToHhmm(newAvailability.endTime || "17:00"),
        status: newAvailability.status === 'unavailable' ? 'unavailable' : 'available',
      };
      const res = await fetch(API_ROUTES.photographerAvailability.create, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await refreshPhotographerSlots();
      }
    } catch {}

  };



  const handleDeleteAvailability = async () => {

    if (!selectedAvailabilityId) return;

    

    setAvailabilities(availabilities.filter(avail => avail.id !== selectedAvailabilityId));

    setIsDeleteDialogOpen(false);

    setSelectedAvailabilityId(null);

    

    toast({

      title: "Availability removed",

      description: "The availability slot has been removed.",

      variant: "destructive",

    });

    // Delete on backend
    try {
      await fetch(API_ROUTES.photographerAvailability.delete(selectedAvailabilityId!), {
        method: 'DELETE',
        headers: authHeaders(),
      });
      await refreshPhotographerSlots();
    } catch {}

  };



  const getAvailabilityIndicator = (day: Date) => {

    

    

    const dStr = format(day, 'yyyy-MM-dd');

    const dow = day.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const rows = selectedPhotographer === 'all' ? allBackendSlots : backendSlots.filter(s => Number(s.photographer_id) === Number(selectedPhotographer));

    const specific = rows.filter(s => s.date === dStr);

    const base = specific.length > 0 ? specific : rows.filter(s => !s.date && s.day_of_week === dow);

    const hasUnavailable = base.some(s => s.status === 'unavailable');

    const hasAvailable = base.some(s => (s.status ?? 'available') !== 'unavailable');

    const hasBooked = false;

    return { hasAvailable, hasBooked, hasUnavailable };

  };



  const getPhotographerName = (id: string) => {

    const photographer = photographers.find(p => p.id === id);

    return photographer ? photographer.name : "Unknown";

  };



  const startEditingAvailability = (availId: string) => {

    const availToEdit = availabilities.find(a => a.id === availId);

    if (availToEdit) {

      setEditingAvailability(availId);

      setEditedAvailability({ ...availToEdit });

    }

  };



  const saveEditedAvailability = async () => {

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

    // Update backend
    try {
      if (!editingAvailability) return;
      const idNum = Number(editingAvailability);
      const payload: any = {
        start_time: uiTimeToHhmm(editedAvailability.startTime),
        end_time: uiTimeToHhmm(editedAvailability.endTime),
        status: (editedAvailability.status === 'unavailable') ? 'unavailable' : (editedAvailability.status ? 'available' : undefined),
      };
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
      if (Object.keys(payload).length) {
        const res = await fetch(API_ROUTES.photographerAvailability.update(idNum), {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          await refreshPhotographerSlots();
        }
      }
    } catch {}

  };



  const saveWeeklySchedule = async () => {

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

    // Persist weekly schedule on backend (appends entries)
    try {
      const mapDay = (d:string) => ({ 'Mon':'monday','Tue':'tuesday','Wed':'wednesday','Thu':'thursday','Fri':'friday','Sat':'saturday','Sun':'sunday' } as any)[d] || d.toLowerCase();
      const payload = {
        photographer_id: Number(selectedPhotographer),
        availabilities: getCurrentWeeklySchedule()
          .filter(day => day.active)
          .map(day => ({
            day_of_week: mapDay(day.day),
            start_time: uiTimeToHhmm(day.startTime),
            end_time: uiTimeToHhmm(day.endTime),
            status: 'available',
          }))
      };
      const res = await fetch(API_ROUTES.photographerAvailability.bulk, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await refreshPhotographerSlots();
      }
    } catch {}

  };



  const toggleEditMode = () => {

    if (editModeOpen) {

      setEditingAvailability(null);

      setEditingWeeklySchedule(false);

      setEditedAvailability({});

    }

    setEditModeOpen(!editModeOpen);

  };



 // Allow editing if admin OR if user is photographer AND selectedPhotographer matches their id

  const canEditAvailability =

    isAdmin ||

    (isPhotographer && user && String(user.id) === String(selectedPhotographer));

  

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

              variant={editModeOpen ? "default" : "accent"}

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

            <p>You are in view-only mode. Only administrators or the selected photographer can edit photographer availability.</p>

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

                  {photographers.map(photographer => (

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

                      onClick={() => { if (editingWeeklySchedule) { saveWeeklySchedule(); } else { setEditingWeeklySchedule(true); } }}

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

                        

                        <div className="text-[11px] mt-1 text-muted-foreground">{avail.origin === 'specific' ? 'Specific date' : 'Weekly'}</div>

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











































