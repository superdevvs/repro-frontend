
import React from 'react';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { Label } from '@/components/ui/label';

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
      <select
        id="category"
        name="category"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
