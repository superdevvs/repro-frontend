
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, CameraIcon, SearchX, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyPhotographerStateProps {
  searchTerm: string;
  onClearFilters: () => void;
  onAddPhotographer?: () => void;
}

export function EmptyPhotographerState({ 
  searchTerm, 
  onClearFilters,
  onAddPhotographer
}: EmptyPhotographerStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 border border-dashed border-gray-300 rounded-lg bg-gray-50/50 transition-all animate-fadeIn">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
        {searchTerm ? (
          <SearchX className="h-16 w-16 text-gray-400 relative z-10" />
        ) : (
          <CameraIcon className="h-16 w-16 text-gray-400 relative z-10" />
        )}
      </div>
      
      <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
        {searchTerm ? "No matching photographers" : "No photographers found"}
      </h3>
      
      <p className="text-gray-500 mb-6 text-center max-w-md">
        {searchTerm 
          ? `We couldn't find any photographers matching "${searchTerm}".` 
          : "There are no photographers in your directory yet."}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {searchTerm && (
          <Button 
            variant="outline" 
            onClick={onClearFilters} 
            className="group transition-all">
            <SearchX className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            Clear search
          </Button>
        )}
        
        {onAddPhotographer && (
          <Button 
            onClick={onAddPhotographer}
            className="group shadow-sm hover:shadow-md transition-all">
            <UserPlus className="mr-2 h-4 w-4" />
            Add photographer
          </Button>
        )}
      </div>
      
      {!searchTerm && !onAddPhotographer && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-md max-w-md">
          <h4 className="font-medium text-blue-700 mb-2">Pro tip</h4>
          <p className="text-sm text-blue-600">
            Add photographers to your directory to easily assign them to shoots and manage their availability.
          </p>
        </div>
      )}
    </div>
  );
}
