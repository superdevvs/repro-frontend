
import React from 'react';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { data: categories, isLoading } = useServiceCategories();

  if (isLoading) {
    return (
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <div className="flex items-center justify-center h-10 border rounded-md">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Category</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="category" className="bg-background">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-categories" disabled>
              No categories available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
