
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { TimeRange } from '@/utils/dateUtils';

interface TimeRangeFilterProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

export function TimeRangeFilter({
  selectedRange,
  onChange,
  className
}: TimeRangeFilterProps) {
  return (
    <div className={`flex flex-col sm:flex-row items-end sm:items-center gap-2 ${className}`}>
      <div className="flex items-center text-xs text-muted-foreground gap-1.5 whitespace-nowrap">
        <Calendar className="h-3.5 w-3.5" />
        <span>Time Period</span>
      </div>
      
      <div className="bg-muted/20 p-1 rounded-lg flex items-center shadow-sm">
        <Button 
          variant={selectedRange === 'day' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('day')} 
          className={`text-xs h-8 px-3 font-medium ${selectedRange === 'day' ? 'shadow-sm' : ''}`}
        >
          Day
        </Button>
        <Button 
          variant={selectedRange === 'week' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('week')} 
          className={`text-xs h-8 px-3 font-medium ${selectedRange === 'week' ? 'shadow-sm' : ''}`}
        >
          Week
        </Button>
        <Button 
          variant={selectedRange === 'month' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('month')} 
          className={`text-xs h-8 px-3 font-medium ${selectedRange === 'month' ? 'shadow-sm' : ''}`}
        >
          Month
        </Button>
        <Button 
          variant={selectedRange === 'year' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('year')} 
          className={`text-xs h-8 px-3 font-medium ${selectedRange === 'year' ? 'shadow-sm' : ''}`}
        >
          Year
        </Button>
      </div>
    </div>
  );
}
