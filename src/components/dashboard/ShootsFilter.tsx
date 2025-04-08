
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewIcon, GridIcon, List, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaQuery } from '@/hooks/use-media-query';

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
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background/50 border-border pr-8"
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

      {isMobile ? (
        <div className="relative">
          <div className="absolute top-0 left-0 w-6 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
          <ScrollArea className="w-full">
            <div className="pb-4">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-max min-w-full">
                <TabsList className="h-auto bg-muted/30 p-1 flex">
                  <TabsTrigger className="px-4 flex-shrink-0" value="all">All</TabsTrigger>
                  <TabsTrigger className="px-4 flex-shrink-0" value="scheduled">Scheduled</TabsTrigger>
                  <TabsTrigger className="px-4 flex-shrink-0" value="completed">Completed</TabsTrigger>
                  <TabsTrigger className="px-4 flex-shrink-0" value="pending">Pending</TabsTrigger>
                  <TabsTrigger className="px-4 flex-shrink-0" value="hold">On Hold</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </ScrollArea>
          <div className="absolute top-0 right-0 w-6 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
        </div>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="w-full h-auto flex flex-wrap bg-muted/30">
            <TabsTrigger className="flex-1" value="all">All</TabsTrigger>
            <TabsTrigger className="flex-1" value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger className="flex-1" value="completed">Completed</TabsTrigger>
            <TabsTrigger className="flex-1" value="pending">Pending</TabsTrigger>
            <TabsTrigger className="flex-1" value="hold">On Hold</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
    </div>
  );
}
