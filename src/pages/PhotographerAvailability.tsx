
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';

const PhotographerAvailability = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Mock data for availability slots
  const mockTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  
  // Mock data for booked times
  const bookedTimes = ['11:00 AM', '2:00 PM'];

  useEffect(() => {
    // This would typically fetch availability data from an API
    setAvailableTimes(mockTimeSlots.filter(time => !bookedTimes.includes(time)));
  }, []);

  const toggleTimeSlot = (time: string) => {
    if (availableTimes.includes(time)) {
      setAvailableTimes(availableTimes.filter(t => t !== time));
    } else {
      setAvailableTimes([...availableTimes, time]);
    }
  };

  return (
    <DashboardLayout>
      <div className="container py-4 sm:py-6 px-2 sm:px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-6">
          {/* Calendar Section */}
          <Card className="w-full md:w-1/2 shadow-md">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Select Date</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="flex justify-center">
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full max-w-full mx-auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Time Slots Section */}
          <Card className="w-full md:w-1/2 shadow-md mt-4 md:mt-0">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Available Time Slots</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="text-center mb-3 sm:mb-4">
                {selectedDate ? (
                  <p className="text-sm sm:text-base md:text-lg font-medium">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">Please select a date</p>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2">
                {mockTimeSlots.map((time) => {
                  const isAvailable = availableTimes.includes(time);
                  const isBooked = bookedTimes.includes(time);
                  
                  return (
                    <div
                      key={time}
                      onClick={() => !isBooked && toggleTimeSlot(time)}
                      className={`
                        p-2 sm:p-3 rounded-md border text-center cursor-pointer transition-all flex flex-col items-center justify-center
                        ${isBooked ? 'bg-gray-100 cursor-not-allowed border-gray-300' : 
                          isAvailable ? 'bg-green-50 border-green-200 hover:bg-green-100' : 
                          'bg-white border-gray-200 hover:bg-gray-50'}
                      `}
                    >
                      <span className="text-xs sm:text-sm font-medium">{time}</span>
                      {isBooked ? (
                        <span className="text-[10px] sm:text-xs text-red-500 flex items-center mt-1">
                          <XCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                          Booked
                        </span>
                      ) : isAvailable ? (
                        <span className="text-[10px] sm:text-xs text-green-600 flex items-center mt-1">
                          <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                          Available
                        </span>
                      ) : (
                        <span className="text-[10px] sm:text-xs text-gray-500 flex items-center mt-1">
                          <XCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                          Unavailable
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 sm:mt-6">
                <Button className="w-full text-sm sm:text-base">Save Availability</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile View Legend - only show on mobile */}
        {isMobile && (
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 border rounded-md bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Legend</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 mr-2"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PhotographerAvailability;
