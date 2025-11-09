
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelect } from "@/components/ui/time-select";
import { format } from "date-fns";
import { MapPin, Calendar as CalendarIcon, Clock, User, Package, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWeatherData } from '@/hooks/useWeatherData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface SchedulingFormProps {
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  formErrors: Record<string, string>;
  setFormErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedPackage: string;
  handleSubmit: () => void;
  goBack: () => void;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  setAddress?: React.Dispatch<React.SetStateAction<string>>;
  setCity?: React.Dispatch<React.SetStateAction<string>>;
  setState?: React.Dispatch<React.SetStateAction<string>>;
  setZip?: React.Dispatch<React.SetStateAction<string>>;
  photographer?: string;
  photographers?: Array<{ id: string; name: string; avatar?: string }>;
  setPhotographer?: React.Dispatch<React.SetStateAction<string>>;
}

export const SchedulingForm: React.FC<SchedulingFormProps> = ({
  date,
  setDate,
  time,
  setTime,
  formErrors,
  setFormErrors,
  selectedPackage,
  handleSubmit,
  goBack,
  address = '',
  city = '',
  state = '',
  zip = '',
  bedrooms = '',
  bathrooms = '',
  sqft = '',
  setAddress,
  setCity,
  setState,
  setZip,
  photographer = '',
  photographers = [],
  setPhotographer
}) => {
  const disabledDates = {
    before: new Date(),
  };
  const { toast } = useToast();
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [photographerDialogOpen, setPhotographerDialogOpen] = useState(false);


  const onDateChange = (newDate: Date | undefined) => {
    // Make sure we're working with the correct date without timezone issues
    if (newDate) {
      // Adjust the date to ensure it's the same as what the user selected
      // This fixes the issue where the date might be off by one day
      const year = newDate.getFullYear();
      const month = newDate.getMonth();
      const day = newDate.getDate();
      const adjustedDate = new Date(year, month, day, 12, 0, 0); // Set to noon to avoid timezone issues

      setDate(adjustedDate);
    } else {
      setDate(undefined);
    }

    if (newDate && formErrors['date']) {
      const { date, ...rest } = formErrors;
      setFormErrors(rest);
    }
    setDateDialogOpen(false);
  };

  const onTimeChange = (newTime: string) => {
    setTime(newTime);
    if (newTime && formErrors['time']) {
      const { time, ...rest } = formErrors;
      setFormErrors(rest);
    }
    setTimeDialogOpen(false);
  };

  const handleGetCurrentLocation = () => {
    if (!setAddress || !setCity || !setState || !setZip) {
      toast({
        title: "Cannot update location",
        description: "The location update functionality is not available.",
        variant: "destructive",
      });
      return;
    }

    setIsLocationLoading(true);

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }

          const data = await response.json();

          setAddress(data.principalSubdivision ? `${data.street || ''} ${data.housenumber || ''}`.trim() : 'Address not found');
          setCity(data.city || data.locality || '');
          setState(data.principalSubdivision || '');
          setZip(data.postcode || '');

          toast({
            title: "Location detected",
            description: "Your current location has been filled in the form.",
            variant: "default",
          });
        } catch (error) {
          console.error('Error fetching location data:', error);
          toast({
            title: "Location detection failed",
            description: "Could not retrieve your current location details.",
            variant: "destructive",
          });
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Could not detect your location.";

        if (error.code === 1) {
          errorMessage = "Location permission denied. Please enable location access.";
        } else if (error.code === 2) {
          errorMessage = "Location unavailable. Please try again later.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out. Please try again.";
        }

        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Get selected photographer details
  const selectedPhotographer = photographers.find(p => p.id === photographer);

  // Weather data for the selected date/location
  const { temperature, condition, distance } = useWeatherData({
    date,
    city,
    state,
    zip,
  });

  // Format the full address for display
  const fullAddress = address && city && state ? `${address}, ${city}, ${state}${zip ? ' ' + zip : ''}` : '';

  // Get selected package name
  const packageName = selectedPackage === 'standard' ? 'Standard'
    : selectedPackage === 'premium' ? 'Premium'
      : selectedPackage === 'deluxe' ? 'Deluxe'
        : selectedPackage;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Location Section */}
        <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Location</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border-blue-600/30"
              onClick={handleGetCurrentLocation}
              disabled={isLocationLoading}
            >
              {isLocationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin size={14} />
              )}
              <span>Current Location</span>
            </Button>
          </div>
          <div
            className="bg-[#131f35] rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-[#1a2842] transition-colors"
            onClick={() => {
              // This should open a dialog or modal for address entry
              if (setAddress && setCity && setState && setZip) {
                toast({
                  title: "Location Entry",
                  description: "You can enter your location using the current location button above, or enter it manually in step 1.",
                });
              }
            }}
          >
            <div>
              {fullAddress ? (
                <>
                  <p className="text-xl font-semibold text-white">{address}</p>
                  <p className="text-gray-400">{`${city}, ${state}${zip ? ' ' + zip : ''}`}</p>
                </>
              ) : (
                <p className="text-gray-400">No address selected</p>
              )}
            </div>
            <div className="text-blue-500">
              <MapPin size={32} />
            </div>
          </div>
        </div>

        {/* Date Selection Section */}
        <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Date</h2>
          <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
            <DialogTrigger asChild>
              <div className="bg-[#131f35] rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-[#1a2842] transition-colors">
                <div>
                  <p className="text-xl font-semibold text-white">
                    {date ? format(date, "MMMM d, yyyy") : "Select a date"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="rounded-lg p-2 text-blue-500 hover:bg-blue-500/20"
                >
                  <CalendarIcon size={32} />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Date</DialogTitle>
              </DialogHeader>
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateChange}
                disabled={disabledDates}
                className="border rounded-md bg-card p-3 pointer-events-auto"
              />
            </DialogContent>
          </Dialog>

          {formErrors['date'] && (
            <p className="text-sm font-medium text-destructive mt-1">{formErrors['date']}</p>
          )}
        </div>

        {/* Time Selection Section */}
        <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Time</h2>
          <Dialog open={timeDialogOpen} onOpenChange={setTimeDialogOpen}>
            <DialogTrigger asChild>
              <div className={cn(
                "bg-[#131f35] rounded-lg p-4 flex justify-between items-center transition-colors",
                date ? "cursor-pointer hover:bg-[#1a2842]" : "opacity-60 cursor-not-allowed"
              )} onClick={() => {
                if (!date) {
                  toast({
                    title: "Select date first",
                    description: "Please choose a date before selecting time.",
                    variant: "destructive",
                  });
                  return;
                }
                setTimeDialogOpen(true);
              }}
              >
                <p className="text-xl font-semibold text-white">{time || "Select a time"}</p>
                <Button
                  variant="ghost"
                  className="rounded-lg p-2 text-blue-500 hover:bg-blue-500/20"
                >
                  <Clock size={32} />
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-full">
              <DialogHeader>
                <DialogTitle>Select Time</DialogTitle>
              </DialogHeader>
              {/* <div className="grid grid-cols-3 gap-2 mt-2">
                {["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={time === t ? "default" : "outline"}
                    onClick={() => onTimeChange(t)}
                    className="w-full"
                  >
                    {t}
                  </Button>
                ))}
              </div> */}
              <div className="mt-4 w-full">
                {/* <h3 className="text-sm font-medium mb-2">Or Select Custom Time</h3> */}
                <TimeSelect
                  value={time}
                  onChange={onTimeChange}
                  startHour={8}
                  endHour={18}
                  interval={10}
                  placeholder="Select a time"
                  className="w-full"
                />
              </div>
            </DialogContent>
          </Dialog>

          {formErrors['time'] && (
            <p className="text-sm font-medium text-destructive mt-1">{formErrors['time']}</p>
          )}
        </div>

        {/* Photographer Section */}
        <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Photographer</h2>
          <Dialog open={photographerDialogOpen} onOpenChange={setPhotographerDialogOpen}>
            <DialogTrigger asChild>
              <div
                className={cn(
                  "bg-[#131f35] rounded-lg p-4 flex justify-between items-center transition-colors",
                  time ? "cursor-pointer hover:bg-[#1a2842]" : "opacity-60 cursor-not-allowed"
                )}
                onClick={() => {
                  if (!time) {
                    toast({
                      title: "Select time first",
                      description: "Please choose a time before selecting a photographer.",
                      variant: "destructive",
                    });
                    return; // stop here if time not selected
                  }
                  setPhotographerDialogOpen(true);
                }}
              >

                <div className="flex items-center">
                  {selectedPhotographer ? (
                    <>
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={selectedPhotographer.avatar} alt={selectedPhotographer.name} />
                        <AvatarFallback>{selectedPhotographer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xl font-semibold text-white">{selectedPhotographer.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-400">Select a photographer</span>
                  )}
                </div>
                <ChevronRight className="text-gray-400" size={24} />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Select Photographer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {photographers.length > 0 ? (
                  photographers.map((photographerItem) => (
                    <Button
                      key={photographerItem.id}
                      variant="outline"
                      className={cn(
                        "flex items-center justify-start gap-4 h-auto p-4",
                        photographer === photographerItem.id && "border-blue-500 bg-blue-500/10"
                      )}
                      onClick={() => {
                        if (setPhotographer) {
                          setPhotographer(photographerItem.id);
                          setPhotographerDialogOpen(false);
                        }
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={photographerItem.avatar} alt={photographerItem.name} />
                        <AvatarFallback>{photographerItem.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{photographerItem.name}</span>
                    </Button>
                  ))
                ) : (
                  <p className="text-center py-4 text-muted-foreground">
                    No photographers available for the selected date and time.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Package Section */}
        {/* <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Package</h2>
          <div className="bg-[#131f35] rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-blue-500 mr-4">
                <Package size={24} />
              </div>
              <span className="text-xl font-semibold text-white">{packageName || "Select a package"}</span>
            </div>
            <div className="bg-blue-500 p-2 rounded">
              <Package size={20} className="text-white" />
            </div>
          </div>
        </div> */}

        {/* Weather Information */}
        {date && (city || zip) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131f35] rounded-lg p-4 flex items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {condition === 'Sunny' ? (
                    <div className="text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                      </svg>
                    </div>
                  ) : condition === 'Cloudy' || condition === 'Partly Cloudy' ? (
                    <div className="text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9" />
                        <path d="M16 14v6" />
                        <path d="M8 14v6" />
                        <path d="M12 16v6" />
                      </svg>
                    </div>
                  )}
                  <span className="text-4xl font-bold text-white">{temperature}°</span>
                </div>
              </div>
            </div>

            <div className="bg-[#131f35] rounded-lg p-4 flex items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="text-blue-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-white">{distance} miles</span>
                    <p className="text-gray-400">away</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="button"
        onClick={handleSubmit}
        className="w-full h-14 text-xl font-bold bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        CONFIRM
      </Button>

      {/* Back Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={goBack}
        className="w-full text-gray-400 hover:text-white"
      >
        Back
      </Button>

      
    </div>
  );
};