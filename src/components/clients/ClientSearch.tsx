
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, FilterIcon, SlidersHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClientSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ClientSearch: React.FC<ClientSearchProps> = ({ searchTerm, setSearchTerm }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="glass-card shadow-sm border-none bg-background/70 backdrop-blur-sm mb-4">
      <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email or company..." 
              className="pl-9 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <FilterIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
