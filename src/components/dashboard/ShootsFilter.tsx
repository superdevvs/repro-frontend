
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  GridIcon, 
  ListIcon, 
  SearchIcon, 
  PlusIcon,
  FilterIcon
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

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
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'scheduled', label: 'Scheduled' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'hold', label: 'On Hold' }
  ];
  
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
      
      <div className="overflow-x-auto pb-1 w-full md:w-auto">
        <div className="flex bg-muted rounded-md p-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md transition-all min-w-[100px]
                ${selectedTab === tab.id 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {onFilterClick && (
          <Button variant="outline" size="icon" onClick={onFilterClick}>
            <FilterIcon className="h-4 w-4" />
          </Button>
        )}
        
        {/* Only show the add button for admins and non-client users */}
        {!isClient && (
          <Button variant="outline" size="icon">
            <PlusIcon className="h-4 w-4" />
          </Button>
        )}
        
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
