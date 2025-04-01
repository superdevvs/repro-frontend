
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

interface PhotographerFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function PhotographerFilter({ 
  searchTerm, 
  setSearchTerm, 
  activeFilter, 
  setActiveFilter 
}: PhotographerFilterProps) {
  return (
    <Card className="glass-card shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search photographers by name, location or specialty..." 
              className="pl-9 h-11"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFilter === 'All' ? 'default' : 'outline'} 
              size="sm"
              className="font-medium transition-colors"
              onClick={() => setActiveFilter('All')}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === 'available' ? 'default' : 'outline'} 
              size="sm"
              className="font-medium text-green-600 bg-green-50 border-green-200 hover:bg-green-100 hover:text-green-700 transition-colors"
              onClick={() => setActiveFilter('available')}
            >
              Available
            </Button>
            <Button 
              variant={activeFilter === 'busy' ? 'default' : 'outline'} 
              size="sm"
              className="font-medium text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
              onClick={() => setActiveFilter('busy')}
            >
              Busy
            </Button>
            <Button 
              variant={activeFilter === 'offline' ? 'default' : 'outline'} 
              size="sm"
              className="font-medium text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              onClick={() => setActiveFilter('offline')}
            >
              Offline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
