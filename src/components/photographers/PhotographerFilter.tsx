
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, X, Camera, Pen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotographerFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeFilter: string;
  setActiveFilter: (value: string) => void;
  activeTab: 'photographers' | 'editors';
  setActiveTab: (value: 'photographers' | 'editors') => void;
}

export function PhotographerFilter({
  searchTerm,
  setSearchTerm,
  activeFilter,
  setActiveFilter,
  activeTab,
  setActiveTab
}: PhotographerFilterProps) {
  return (
    <div className="space-y-4">
      {/* Tabs for Photographers/Editors */}
      <div className="flex justify-between items-center">
        <ToggleGroup type="single" value={activeTab} onValueChange={(value) => value && setActiveTab(value as 'photographers' | 'editors')} className="border rounded-lg p-1 bg-muted/20">
          <ToggleGroupItem value="photographers" className="rounded-md gap-2 data-[state=on]:bg-background data-[state=on]:shadow">
            <Camera className="h-4 w-4" />
            <span>Photographers</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="editors" className="rounded-md gap-2 data-[state=on]:bg-background data-[state=on]:shadow">
            <Pen className="h-4 w-4" />
            <span>Editors</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={activeTab === 'photographers' ? "Search photographers..." : "Search editors..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={activeFilter === 'All' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('All')}
            className={cn(
              "text-xs sm:text-sm",
              activeFilter === 'All' ? "bg-primary text-primary-foreground" : ""
            )}
          >
            All
          </Button>
          <Button
            variant={activeFilter === 'Available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('Available')}
            className={cn(
              "text-xs sm:text-sm",
              activeFilter === 'Available' ? "bg-green-600 text-white hover:bg-green-700" : ""
            )}
          >
            Available
          </Button>
          <Button
            variant={activeFilter === 'Busy' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('Busy')}
            className={cn(
              "text-xs sm:text-sm",
              activeFilter === 'Busy' ? "bg-amber-500 text-white hover:bg-amber-600" : ""
            )}
          >
            Busy
          </Button>
          <Button
            variant={activeFilter === 'Offline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('Offline')}
            className={cn(
              "text-xs sm:text-sm",
              activeFilter === 'Offline' ? "bg-gray-500 text-white hover:bg-gray-600" : ""
            )}
          >
            Offline
          </Button>
        </div>
      </div>
    </div>
  );
}
