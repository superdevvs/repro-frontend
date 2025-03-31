
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GridIcon, 
  ListIcon, 
  SearchIcon, 
  PlusIcon,
  FilterIcon
} from 'lucide-react';

interface ShootsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onFilterClick?: () => void;
}

export function ShootsFilter({ 
  searchTerm, 
  setSearchTerm, 
  selectedTab, 
  setSelectedTab, 
  viewMode,
  setViewMode,
  onFilterClick
}: ShootsFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by address, photographer, or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Tabs 
        defaultValue="scheduled" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full md:w-auto"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="hold">On Hold</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        {onFilterClick && (
          <Button variant="outline" size="icon" onClick={onFilterClick}>
            <FilterIcon className="h-4 w-4" />
          </Button>
        )}
        
        <Button variant="outline" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
        
        <div className="flex border rounded-md overflow-hidden">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-none"
            onClick={() => setViewMode('grid')}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            className="rounded-none"
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
