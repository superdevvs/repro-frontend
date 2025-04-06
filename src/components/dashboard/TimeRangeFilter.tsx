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
  return <div className={`flex flex-col sm:flex-row items-end sm:items-center gap-2 ${className}`}>
      <div className="flex items-center text-xs text-muted-foreground gap-1 whitespace-nowrap">
        
        
      </div>
      
      <div className="bg-muted/20 p-1 rounded-lg flex items-center">
        <Button variant={selectedRange === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => onChange('day')} className="text-xs h-8">
          Day
        </Button>
        <Button variant={selectedRange === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => onChange('week')} className="text-xs h-8">
          Week
        </Button>
        <Button variant={selectedRange === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => onChange('month')} className="text-xs h-8">
          Month
        </Button>
        <Button variant={selectedRange === 'year' ? 'default' : 'ghost'} size="sm" onClick={() => onChange('year')} className="text-xs h-8">
          Year
        </Button>
      </div>
    </div>;
}