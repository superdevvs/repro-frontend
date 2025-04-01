
import React from 'react';
import { Button } from '@/components/ui/button';
import { CameraIcon } from 'lucide-react';

interface EmptyPhotographerStateProps {
  searchTerm: string;
  onClearFilters: () => void;
}

export function EmptyPhotographerState({ searchTerm, onClearFilters }: EmptyPhotographerStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 border border-dashed border-gray-300 rounded-lg bg-gray-50/50">
      <CameraIcon className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-700">No photographers found</h3>
      <p className="text-gray-500 mb-4 text-center max-w-md">
        {searchTerm 
          ? `No photographers match your search "${searchTerm}".` 
          : "There are no photographers matching your filters."}
      </p>
      <Button onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}
