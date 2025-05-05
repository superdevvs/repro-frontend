
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const PhotographerAvailability = () => {
  const { user, role } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for availability slots
  const mockTimeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
  
  // Mock data for booked times
  const bookedTimes = ['11:00 AM', '2:00 PM'];

  useEffect(() => {
    // Restrict access to photographers only
    if (role !== 'photographer') {
      toast({
        title: "Access Denied",
        description: "Only photographers can access their own availability settings.",
        variant: "destructive"
      });
      
      // Redirect to dashboard or appropriate page
      navigate('/dashboard');
      return;
    }

    // This would typically fetch availability data from an API for the current photographer only
    setAvailableTimes(mockTimeSlots.filter(time => !bookedTimes.includes(time)));
    setLoading(false);
  }, [role, navigate]);

  const toggleTimeSlot = (time: string) => {
    if (availableTimes.includes(time)) {
      setAvailableTimes(availableTimes.filter(t => t !== time));
    } else {
      setAvailableTimes([...availableTimes, time]);
    }
  };

  const handleSaveAvailability = () => {
    // Here we would save the availability data to the backend
    // This would only allow the logged-in photographer to save their own data
    
    toast({
      title: "Availability Saved",
      description: "Your availability settings have been updated successfully.",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container py-6 px-4">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block mb-4"></div>
              <p>Loading your availability settings...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (role !== 'photographer') {
    return null; // This should not render as we redirect in useEffect
  }

  return (
    <DashboardLayout>
      <div className="container py-4 sm:py-6 px-2 sm:px-4 md:px-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are viewing your personal availability settings. Only you can see and edit these settings.
              </p>
            </div>
          </div>
        </div>
        
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
                <span>Your Available Time Slots</span>
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
                <Button onClick={handleSaveAvailability} className="w-full text-sm sm:text-base">Save Availability</Button>
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
