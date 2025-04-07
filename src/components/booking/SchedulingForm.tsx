
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { TimeSelect } from "@/components/ui/time-select";
import { format } from "date-fns";
import { MapPin, Calendar as CalendarIcon, Clock, User, Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWeatherData } from '@/hooks/useWeatherData';

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
  photographer?: string;
  photographers?: Array<{ id: string; name: string; avatar?: string }>;
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
  photographer = '',
  photographers = []
}) => {
  const disabledDates = {
    before: new Date(),
  };

  const onDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && formErrors['date']) {
      const { date, ...rest } = formErrors;
      setFormErrors(rest);
    }
  };

  const onTimeChange = (newTime: string) => {
    setTime(newTime);
    if (newTime && formErrors['time']) {
      const { time, ...rest } = formErrors;
      setFormErrors(rest);
    }
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
          <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
          <div className="bg-[#131f35] rounded-lg p-4 flex justify-between items-center">
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
          <div className="bg-[#131f35] rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold text-white">
                {date ? format(date, "MMMM d, yyyy") : "Select a date"}
              </p>
            </div>
            <Button 
              variant="ghost" 
              className="rounded-lg p-2 text-blue-500 hover:bg-blue-500/20"
              onClick={() => document.getElementById('date-picker-modal')?.click()}
            >
              <CalendarIcon size={32} />
            </Button>
          </div>
          
          {/* Hidden date picker wrapper */}
          <div className="hidden">
            <Button id="date-picker-modal" className="hidden">Open Date Picker</Button>
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              disabled={disabledDates}
              className="border rounded-md bg-card p-3"
            />
          </div>
          
          {formErrors['date'] && (
            <p className="text-sm font-medium text-destructive mt-1">{formErrors['date']}</p>
          )}
        </div>
        
        {/* Time Selection Section */}
        <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Time</h2>
          <div className="bg-[#131f35] rounded-lg p-4 flex justify-between items-center">
            <p className="text-xl font-semibold text-white">{time || "Select a time"}</p>
            <Button 
              variant="ghost" 
              className="rounded-lg p-2 text-blue-500 hover:bg-blue-500/20"
              onClick={() => document.getElementById('time-select-modal')?.click()}
            >
              <Clock size={32} />
            </Button>
          </div>
          
          {/* Time selection grid (hidden initially) */}
          <div className="hidden">
            <Button id="time-select-modal" className="hidden">Open Time Selector</Button>
            <div className="grid grid-cols-3 gap-2 mt-2">
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
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Or Select Custom Time</h3>
              <TimeSelect
                value={time}
                onChange={onTimeChange}
                startHour={8}
                endHour={18}
                interval={30}
                placeholder="Select a time"
                className="w-full"
              />
            </div>
          </div>
          
          {formErrors['time'] && (
            <p className="text-sm font-medium text-destructive mt-1">{formErrors['time']}</p>
          )}
        </div>
        
        {/* Photographer Section */}
        <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white mb-4">Photographer</h2>
          <div className="bg-[#131f35] rounded-lg p-4 flex justify-between items-center">
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
        </div>
        
        {/* Package Section */}
        <div className="bg-[#0e1525] rounded-lg p-6 space-y-2">
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
        </div>

        {/* Weather Information */}
        {date && (city || zip) && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#131f35] rounded-lg p-4 flex items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {condition === 'Sunny' ? (
                    <div className="text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                    </div>
                  ) : condition === 'Cloudy' || condition === 'Partly Cloudy' ? (
                    <div className="text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                      </svg>
                    </div>
                  ) : (
                    <div className="text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/>
                        <path d="M16 14v6"/>
                        <path d="M8 14v6"/>
                        <path d="M12 16v6"/>
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
                    <span className="text-2xl font-bold text-white">{distance} km</span>
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
