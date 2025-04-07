
import React from 'react';
import { Button } from '@/components/ui/button';

interface FilterGroupProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

export function FilterGroup({ title, options, selectedValues, onChange }: FilterGroupProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
      <div className="flex flex-wrap gap-1">
        {options.map((option) => (
          <Button
            key={option}
            variant={selectedValues.includes(option) ? "default" : "outline"}
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              const newValues = selectedValues.includes(option)
                ? selectedValues.filter(v => v !== option)
                : [...selectedValues, option];
              onChange(newValues);
            }}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}
