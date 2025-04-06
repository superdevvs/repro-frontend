
import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeRange } from '@/utils/dateUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TimeRangeFilterProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

export function TimeRangeFilter({ selectedRange, onChange, className }: TimeRangeFilterProps) {
  const isMobile = useIsMobile();
  
  const ranges: { label: string; value: TimeRange }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  // Format the label for the selected range
  const getSelectedRangeLabel = () => {
    const currentRange = ranges.find(range => range.value === selectedRange);
    return `This ${currentRange?.label}`;
  };

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      {!isMobile && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 mb-1 text-sm font-normal text-muted-foreground"
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{getSelectedRangeLabel()}</span>
        </Button>
      )}
      
      <div className={cn(
        "inline-flex rounded-md shadow-sm bg-blue-50/50 dark:bg-blue-950/20 p-0.5",
        isMobile && "w-full justify-center"
      )}>
        {ranges.map((range) => (
          <Button
            key={range.value}
            onClick={() => onChange(range.value)}
            variant={selectedRange === range.value ? 'default' : 'ghost'}
            size={isMobile ? "sm" : "default"}
            className={cn(
              selectedRange === range.value 
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
              "rounded-md font-normal",
              isMobile ? "h-8 px-3 text-xs flex-1" : ""
            )}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
