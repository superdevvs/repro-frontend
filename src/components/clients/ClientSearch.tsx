
import React from 'react';
import { Search, FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClientSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clientCount?: number;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({ 
  searchTerm, 
  setSearchTerm,
  clientCount
}) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 flex-col sm:flex-row">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients by name, company or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <FilterIcon className="h-4 w-4" />
          </Button>
          
          {clientCount !== undefined && searchTerm && (
            <Badge variant="outline" className="ml-2 bg-card">
              {clientCount} {clientCount === 1 ? 'result' : 'results'} found
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
