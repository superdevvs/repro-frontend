
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, SearchIcon } from 'lucide-react';

interface ShootsFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

export function ShootsFilter({
  searchTerm,
  setSearchTerm,
  selectedTab,
  setSelectedTab,
  viewMode,
  setViewMode
}: ShootsFilterProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by address, client, or photographer..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant={selectedTab === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('all')}
            >
              All
            </Button>
            <Button 
              variant={selectedTab === 'scheduled' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('scheduled')}
            >
              Scheduled
            </Button>
            <Button 
              variant={selectedTab === 'completed' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('completed')}
            >
              Completed
            </Button>
            <Button 
              variant={selectedTab === 'pending' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={selectedTab === 'hold' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedTab('hold')}
            >
              Hold
            </Button>
            
            <div className="ml-auto flex border rounded-md overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="rounded-none"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                className="rounded-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
