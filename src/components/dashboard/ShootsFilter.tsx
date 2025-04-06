
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeRange } from "@/types/shoots";

export interface ShootsFilterProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

export function ShootsFilter({ value, onChange }: ShootsFilterProps) {
  const handleValueChange = (newValue: string) => {
    onChange(newValue as TimeRange);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Filter by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="today">Today</SelectItem>
        <SelectItem value="week">This Week</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="year">This Year</SelectItem>
        <SelectItem value="all">All Time</SelectItem>
      </SelectContent>
    </Select>
  );
}
