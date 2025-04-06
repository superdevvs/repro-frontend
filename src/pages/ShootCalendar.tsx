
import React, { useState } from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import { useShoots } from '@/context/ShootsContext';
import { Calendar } from '@/components/dashboard/Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShootsFilter } from '@/components/dashboard/ShootsFilter';
import { TimeRange, ShootData } from '@/types/shoots';
import { useAuth } from '@/components/auth/AuthProvider';
import ShootDetail from '@/components/dashboard/ShootDetail';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ShootCalendar() {
  const { shoots } = useShoots();
  const { role } = useAuth();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('week');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const navigate = useNavigate();

  const isAdmin = role === 'admin' || role === 'superadmin';
  
  // Filter shoots for selected date
  const shootsForSelectedDate = selectedDate 
    ? shoots.filter(shoot => {
        const shootDate = typeof shoot.scheduledDate === 'string' 
          ? parseISO(shoot.scheduledDate) 
          : shoot.scheduledDate;
        return isSameDay(shootDate, selectedDate);
      })
    : [];

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedShoot(null);
  };

  const handleShootClick = (shoot: ShootData) => {
    setSelectedShoot(shoot);
  };

  const handleCloseShootDetail = () => {
    setSelectedShoot(null);
  };

  const handleBookClick = () => {
    navigate('/book-shoot');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Shoot Calendar</h1>
          <p className="text-muted-foreground">
            View and manage all scheduled photo shoots
          </p>
        </div>

        {isAdmin && (
          <Button onClick={handleBookClick}>Book New Shoot</Button>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Calendar</CardTitle>
                
                <ShootsFilter 
                  value={selectedRange}
                  onChange={handleRangeChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Calendar 
                shoots={shoots}
                className="h-[600px]" 
                onDateSelect={handleDateSelect}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a Date'}
                </CardTitle>
                
                {selectedDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedDate(undefined)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedShoot ? (
                  <ShootDetail 
                    shoot={selectedShoot} 
                    onClose={handleCloseShootDetail} 
                  />
                ) : (
                  shootsForSelectedDate.length > 0 ? (
                    <div className="space-y-4">
                      {shootsForSelectedDate.map(shoot => (
                        <Card 
                          key={shoot.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleShootClick(shoot)}
                        >
                          <CardContent className="p-4">
                            <div className="font-medium">{shoot.client.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {shoot.time || 'No time specified'}
                            </div>
                            <div className="text-sm truncate">
                              {shoot.location.address}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No shoots scheduled for this date
                    </div>
                  )
                )
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select a date to view scheduled shoots
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
