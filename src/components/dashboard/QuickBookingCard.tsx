
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, User, Package, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

export function QuickBookingCard() {
  const navigate = useNavigate();
  
  const handleQuickBook = () => {
    navigate('/book-shoot');
  };
  
  return (
    <Card className="mb-6 overflow-hidden bg-[#0e1525] border-[#131f35]">
      <CardContent className="p-0">
        <div className="p-5 grid gap-4">
          <h3 className="text-xl font-semibold text-white">Quick Book New Shoot</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-[#131f35] rounded-lg p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-xs">Location</span>
              </div>
              <span className="text-sm font-medium text-white truncate">Select Address</span>
            </div>
            
            <div className="bg-[#131f35] rounded-lg p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-xs">Date</span>
              </div>
              <span className="text-sm font-medium text-white truncate">Select Date</span>
            </div>
            
            <div className="bg-[#131f35] rounded-lg p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-xs">Time</span>
              </div>
              <span className="text-sm font-medium text-white truncate">Select Time</span>
            </div>
            
            <div className="bg-[#131f35] rounded-lg p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <User className="h-4 w-4 text-blue-500" />
                <span className="text-xs">Photographer</span>
              </div>
              <span className="text-sm font-medium text-white truncate">Select</span>
            </div>
            
            <div className="bg-[#131f35] rounded-lg p-3 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Package className="h-4 w-4 text-blue-500" />
                <span className="text-xs">Package</span>
              </div>
              <span className="text-sm font-medium text-white truncate">Select</span>
            </div>
          </div>
          
          <Button 
            variant="default" 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full"
            onClick={handleQuickBook}
          >
            Book New Shoot 
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
