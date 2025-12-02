import React, { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  PhoneIcon, 
  MailIcon,
  CameraIcon,
  Sun,
  CloudRain,
  Cloud,
  Snowflake,
  UserPlus,
  Search,
  ArrowUpDown,
  Loader2,
  MapPin,
} from 'lucide-react';
import { format } from 'date-fns';
import { ShootData } from '@/types/shoots';
import { WeatherInfo } from '@/services/weatherService';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/env';
import { calculateDistance, getCoordinatesFromAddress } from '@/utils/distanceUtils';
import { cn } from '@/lib/utils';

interface ShootDetailsOverviewTabProps {
  shoot: ShootData;
  isAdmin: boolean;
  isPhotographer: boolean;
  isEditor: boolean;
  isClient: boolean;
  role: string;
  onShootUpdate: () => void;
  weather?: WeatherInfo | null;
}

export function ShootDetailsOverviewTab({
  shoot,
  isAdmin,
  isPhotographer,
  isEditor,
  isClient,
  role,
  onShootUpdate,
  weather,
}: ShootDetailsOverviewTabProps) {
  const { toast } = useToast();
  const [assignPhotographerOpen, setAssignPhotographerOpen] = useState(false);
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('');
  const [photographers, setPhotographers] = useState<Array<{ 
    id: string; 
    name: string; 
    email: string;
    avatar?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    distance?: number;
  }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'distance' | 'name'>('distance');
  const [isCalculatingDistances, setIsCalculatingDistances] = useState(false);
  
  // Check if user is admin or rep
  const isAdminOrRep = isAdmin || role === 'rep' || role === 'representative';

  // Get shoot location for distance calculation
  const getShootLocation = () => {
    const address = shoot.location?.address || (shoot as any).address || '';
    const city = shoot.location?.city || (shoot as any).city || '';
    const state = shoot.location?.state || (shoot as any).state || '';
    const zip = shoot.location?.zip || (shoot as any).zip || '';
    return { address, city, state, zip };
  };

  // Fetch photographers for assignment
  useEffect(() => {
    if (!assignPhotographerOpen || !isAdminOrRep) return;
    
    const fetchPhotographers = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/users/photographers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (res.ok) {
          const json = await res.json();
          const photographersList = (json.data || json || []).map((p: any) => ({
            id: String(p.id),
            name: p.name,
            email: p.email,
            avatar: p.avatar,
            address: p.address || p.metadata?.address || p.metadata?.homeAddress,
            city: p.city || p.metadata?.city,
            state: p.state || p.metadata?.state,
            zip: p.zip || p.zipcode || p.metadata?.zip || p.metadata?.zipcode,
          }));
          setPhotographers(photographersList);
        }
      } catch (error) {
        console.error('Error fetching photographers:', error);
      }
    };
    
    fetchPhotographers();
  }, [assignPhotographerOpen, isAdminOrRep]);

  // Calculate distances when dialog opens and shoot location/photographers are available
  useEffect(() => {
    const calculateDistances = async () => {
      if (!assignPhotographerOpen || photographers.length === 0) return;
      
      const shootLocation = getShootLocation();
      if (!shootLocation.address || !shootLocation.city || !shootLocation.state) {
        return; // Can't calculate without location
      }

      setIsCalculatingDistances(true);
      try {
        // Get coordinates for shoot location
        const shootCoords = await getCoordinatesFromAddress(
          shootLocation.address,
          shootLocation.city,
          shootLocation.state,
          shootLocation.zip
        );
        
        if (!shootCoords) {
          setIsCalculatingDistances(false);
          return;
        }

        // Calculate distance for each photographer
        const photographersWithDist = await Promise.all(
          photographers.map(async (photographer) => {
            if (!photographer.address || !photographer.city || !photographer.state) {
              return { ...photographer, distance: undefined };
            }

            const photographerCoords = await getCoordinatesFromAddress(
              photographer.address,
              photographer.city,
              photographer.state,
              photographer.zip
            );

            if (!photographerCoords) {
              return { ...photographer, distance: undefined };
            }

            const dist = calculateDistance(
              shootCoords.lat,
              shootCoords.lon,
              photographerCoords.lat,
              photographerCoords.lon
            );

            return {
              ...photographer,
              distance: Math.round(dist * 10) / 10, // Round to 1 decimal
            };
          })
        );

        setPhotographers(photographersWithDist);
      } catch (error) {
        console.error('Error calculating distances:', error);
      } finally {
        setIsCalculatingDistances(false);
      }
    };

    calculateDistances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignPhotographerOpen, photographers.length]);

  // Filter and sort photographers
  const filteredAndSortedPhotographers = useMemo(() => {
    let filtered = photographers;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.city?.toLowerCase().includes(query) ||
        p.state?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        // Sort by distance (undefined distances go to end)
        if (a.distance === undefined && b.distance === undefined) return 0;
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      } else {
        // Sort by name
        return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [photographers, searchQuery, sortBy]);

  // Assign photographer
  const handleAssignPhotographer = async () => {
    if (!selectedPhotographerId) return;
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/shoots/${shoot.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ photographer_id: selectedPhotographerId }),
      });
      
      if (!res.ok) throw new Error('Failed to assign photographer');
      
      toast({
        title: 'Success',
        description: 'Photographer assigned successfully',
      });
      setAssignPhotographerOpen(false);
      setSelectedPhotographerId('');
      onShootUpdate();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign photographer',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Not set';
      return format(date, 'MMMM d, yyyy');
    } catch {
      return 'Not set';
    }
  };

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return 'Not set';
    // If time is in format like "09:00 AM" or "09:00:00", return as is
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString;
    }
    // If it's just time like "09:00", try to format it
    const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = timeMatch[2];
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      return `${displayHours}:${minutes} ${period}`;
    }
    return timeString;
  };

  // Get location address - handle different data structures
  const getLocationAddress = () => {
    if (shoot.location?.address) return shoot.location.address;
    if (shoot.location?.fullAddress) return shoot.location.fullAddress;
    // Fallback to direct properties if location object doesn't exist
    if ((shoot as any).address) return (shoot as any).address;
    return 'Not set';
  };

  // Get location city/state/zip
  const getLocationDetails = () => {
    const city = shoot.location?.city || (shoot as any).city || '';
    const state = shoot.location?.state || (shoot as any).state || '';
    const zip = shoot.location?.zip || (shoot as any).zip || '';
    return { city, state, zip };
  };

  // Get services - handle different data structures
  const getServices = () => {
    if (Array.isArray(shoot.services) && shoot.services.length > 0) {
      return shoot.services;
    }
    // Check if service is a single object
    if ((shoot as any).service) {
      const service = (shoot as any).service;
      if (typeof service === 'string') return [service];
      if (service.name) return [service.name];
      if (Array.isArray(service)) return service;
    }
    // Check if services is a string
    if (typeof shoot.services === 'string' && shoot.services) {
      return [shoot.services];
    }
    return [];
  };

  const services = getServices();
  const locationDetails = getLocationDetails();

  // Render weather icon based on weather type - matching dashboard size
  const renderWeatherIcon = (icon?: string) => {
    switch (icon) {
      case 'sunny':
        return <Sun size={14} className="text-muted-foreground" />;
      case 'rainy':
        return <CloudRain size={14} className="text-muted-foreground" />;
      case 'snowy':
        return <Snowflake size={14} className="text-muted-foreground" />;
      default:
        return <Cloud size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-2">
      {/* Structured card layout matching the image design */}
      
      {/* Date & Time and Weather - Side by Side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Date & Time Card */}
        <div className="p-2.5 border rounded-lg bg-card">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase">Date & Time</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{formatDate(shoot.scheduledDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">{formatTime(shoot.time)}</span>
            </div>
          </div>
        </div>

        {/* Weather Card (if available) - Matching dashboard pill style with details */}
        {(weather && (weather.temperature || weather.description)) || shoot.weather?.temperature || (shoot as any).temperature ? (
          <div className="p-2.5 border rounded-lg bg-card">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">Weather</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs font-semibold text-muted-foreground bg-background shadow-sm w-fit">
                {renderWeatherIcon(weather?.icon)}
                <span>{weather?.temperature ?? shoot.weather?.temperature ?? (shoot as any).temperature ?? '--°'}</span>
              </div>
              {weather?.description && (
                <div className="text-xs text-muted-foreground capitalize">
                  {weather.description}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-2.5 border rounded-lg bg-card">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">Weather</span>
            </div>
            <div className="flex items-center gap-1 rounded-full border border-border px-2 py-1 text-xs font-semibold text-muted-foreground bg-background shadow-sm w-fit">
              <Cloud size={14} className="text-muted-foreground" />
              <span>--°</span>
            </div>
          </div>
        )}
      </div>

      {/* Location Card - Full width where weather was */}
      <div className="p-2.5 border rounded-lg bg-card">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Location</span>
        </div>
        <div className="text-xs">
          <div className="font-medium truncate">{getLocationAddress()}</div>
          <div className="text-muted-foreground mt-0.5 truncate">
            {[locationDetails.city, locationDetails.state, locationDetails.zip].filter(Boolean).join(', ') || 'Not set'}
          </div>
        </div>
      </div>

      {/* Services Card */}
      <div className="p-2.5 border rounded-lg bg-card">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Services</span>
        <div className="flex flex-wrap gap-1">
          {services.length > 0 ? (
            services.map((service, index) => (
              <Badge key={index} variant="outline" className="text-[10px] px-1.5 py-0.5">
                {typeof service === 'string' ? service : (service as any).label || (service as any).name || String(service)}
              </Badge>
            ))
          ) : (
            <div className="text-xs text-muted-foreground">No services</div>
          )}
        </div>
      </div>

      {/* Client & Contact Card */}
      <div className="p-2.5 border rounded-lg bg-card">
        <div className="flex items-center gap-1.5 mb-1.5">
          <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Client</span>
        </div>
        <div className="space-y-0.5 text-xs">
          <div className="font-medium">{shoot.client?.name}</div>
          {shoot.client?.company && (
            <div className="text-muted-foreground">{shoot.client.company}</div>
          )}
          {shoot.client?.email && (
            <a href={`mailto:${shoot.client.email}`} className="text-primary hover:underline block truncate">
              {shoot.client.email}
            </a>
          )}
          {shoot.client?.phone && (
            <a href={`tel:${shoot.client.phone}`} className="text-primary hover:underline block">
              {shoot.client.phone}
            </a>
          )}
        </div>
      </div>

      {/* Photographer Card */}
      <div className="p-2.5 border rounded-lg bg-card">
        <div className="flex items-center gap-1.5 mb-1.5">
          <CameraIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Photographer</span>
        </div>
        {shoot.photographer ? (
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">{shoot.photographer.name}</span>
            {(isAdmin || isClient) && shoot.photographer.id && (
              <div className="flex gap-1">
                <a 
                  href={`mailto:${(shoot.photographer as any).email}`}
                  className="p-1.5 hover:bg-muted rounded"
                  title="Email"
                >
                  <MailIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
                <a 
                  href={`tel:${(shoot.photographer as any).phone}`}
                  className="p-1.5 hover:bg-muted rounded"
                  title="Call"
                >
                  <PhoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Not assigned</div>
            {isAdminOrRep && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-3 font-medium"
                onClick={() => setAssignPhotographerOpen(true)}
              >
                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                Assign
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Schedule Info Card */}
      <div className="p-2.5 border rounded-lg bg-card">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Schedule Info</span>
        <div className="space-y-0.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created by:</span>
            <span>{shoot.createdBy || 'Unknown'}</span>
          </div>
          {shoot.completedDate && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed:</span>
              <span>{formatDate(shoot.completedDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary Card */}
      <div className="p-2.5 border rounded-lg bg-card">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 block">Payment</span>
        <div className="space-y-0.5 text-xs">
          {isAdmin ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base:</span>
                <span>${shoot.payment?.baseQuote?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span>${shoot.payment?.taxAmount?.toFixed(2) || '0.00'}</span>
              </div>
              <Separator className="my-1.5" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${shoot.payment?.totalQuote?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid:</span>
                <span>${shoot.payment?.totalPaid?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <span className={((shoot.payment?.totalQuote || 0) - (shoot.payment?.totalPaid || 0) > 0) ? 'text-orange-600 font-medium' : 'text-green-600'}>
                  ${((shoot.payment?.totalQuote || 0) - (shoot.payment?.totalPaid || 0)).toFixed(2)}
                </span>
              </div>
            </>
          ) : isClient ? (
            <>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${shoot.payment?.totalQuote?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid:</span>
                <span>${shoot.payment?.totalPaid?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outstanding:</span>
                <span className={((shoot.payment?.totalQuote || 0) - (shoot.payment?.totalPaid || 0) > 0) ? 'text-orange-600 font-medium' : 'text-green-600'}>
                  ${((shoot.payment?.totalQuote || 0) - (shoot.payment?.totalPaid || 0)).toFixed(2)}
                </span>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground">Not available</div>
          )}
        </div>
      </div>

      {/* Assign Photographer Dialog - Matching Book Shoot selector */}
      <Dialog open={assignPhotographerOpen} onOpenChange={(open) => {
        setAssignPhotographerOpen(open);
        if (!open) {
          setSearchQuery('');
          setSelectedPhotographerId('');
        }
      }}>
        <DialogContent className="sm:max-w-md w-full">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <DialogHeader>
                  <DialogTitle className="text-lg text-slate-900 dark:text-slate-100">Select Photographer</DialogTitle>
                </DialogHeader>
              </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="space-y-3 mb-4">
              {/* Search Field */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search photographers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value: 'distance' | 'name') => setSortBy(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Sort by Distance</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {/* Scrollable content area */}
              <div className="pt-3 max-h-[48vh] overflow-y-auto pr-2">
                {isCalculatingDistances ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Calculating distances...</span>
                  </div>
                ) : filteredAndSortedPhotographers.length > 0 ? (
                  <div className="grid gap-3">
                    {filteredAndSortedPhotographers.map((photographerItem) => (
                      <div
                        key={photographerItem.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={photographerItem.avatar} alt={photographerItem.name} />
                            <AvatarFallback>{photographerItem.name?.charAt(0)}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                              {photographerItem.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                              {photographerItem.distance !== undefined ? (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {photographerItem.distance} mi away
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Distance unavailable</span>
                              )}
                              {photographerItem.city && photographerItem.state && (
                                <span className="text-muted-foreground">
                                  • {photographerItem.city}, {photographerItem.state}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPhotographerId(photographerItem.id);
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-md text-sm font-medium shadow-sm transition-colors",
                              selectedPhotographerId === photographerItem.id
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"
                            )}
                          >
                            {selectedPhotographerId === photographerItem.id ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                    {searchQuery ? 'No photographers found matching your search.' : 'No photographers available.'}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="pt-4">
                <div className="flex items-center justify-between gap-3">
                  <Button variant="ghost" onClick={() => {
                    setAssignPhotographerOpen(false);
                    setSearchQuery('');
                    setSelectedPhotographerId('');
                  }} className="w-full">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!selectedPhotographerId) {
                        toast({
                          title: "No photographer selected",
                          description: "Please select a photographer before continuing.",
                          variant: "destructive",
                        });
                        return;
                      }
                      handleAssignPhotographer();
                    }}
                    className="w-full"
                    disabled={!selectedPhotographerId}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



