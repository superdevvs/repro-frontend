
import React from 'react';
import { Button } from '@/components/ui/button';
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
      <div className="flex items-center rounded-md">
        <Button 
          variant={selectedRange === 'day' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('day')} 
          className={`h-8 px-3 rounded-l-md ${selectedRange !== 'day' ? 'hover:bg-muted' : ''}`}
        >
          Day
        </Button>
        <Button 
          variant={selectedRange === 'week' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('week')} 
          className={`h-8 px-3 ${selectedRange !== 'week' ? 'hover:bg-muted' : ''}`}
        >
          Week
        </Button>
        <Button 
          variant={selectedRange === 'month' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('month')} 
          className={`h-8 px-3 ${selectedRange !== 'month' ? 'hover:bg-muted' : ''}`}
        >
          Month
        </Button>
        <Button 
          variant={selectedRange === 'year' ? 'default' : 'ghost'} 
          size="sm" 
          onClick={() => onChange('year')} 
          className={`h-8 px-3 rounded-r-md ${selectedRange !== 'year' ? 'hover:bg-muted' : ''}`}
        >
          Year
        </Button>
      </div>
    </div>
  );
}
