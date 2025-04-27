
import React from 'react';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { data: categories, isLoading } = useServiceCategories();

  if (isLoading) return null;

  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Category</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
