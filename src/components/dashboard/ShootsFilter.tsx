
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewIcon, GridIcon, List, Search, MapPin } from 'lucide-react';

interface ShootsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
}

export function ShootsFilter({
  searchTerm,
  setSearchTerm,
  selectedTab,
  setSelectedTab,
  viewMode,
  setViewMode,
}: ShootsFilterProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address, photographer, or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border"
          />
          {searchTerm && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="h-9 w-9"
          >
            <GridIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="h-9 w-9"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full h-auto flex flex-wrap bg-muted/30">
          <TabsTrigger className="flex-1" value="all">All</TabsTrigger>
          <TabsTrigger className="flex-1" value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger className="flex-1" value="completed">Completed</TabsTrigger>
          <TabsTrigger className="flex-1" value="pending">Pending</TabsTrigger>
          <TabsTrigger className="flex-1" value="hold">On Hold</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
