
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShootsList } from '@/components/dashboard/ShootsList';
import { useShoots } from '@/context/ShootsContext';
import { CalendarIcon, FilterIcon } from 'lucide-react';
import { Shell } from '@/components/layout/Shell';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { ensureDateString, formatDateSafe } from '@/utils/formatters';

export function PhotographerShootHistory() {
  const { shoots } = useShoots();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const itemsPerPage = 10;

  const filteredShoots = shoots.filter(shoot => {
    if (filter === 'all') return true;
    return shoot.status === filter;
  });

  const indexOfLastShoot = currentPage * itemsPerPage;
  const indexOfFirstShoot = indexOfLastShoot - itemsPerPage;
  const currentShoots = filteredShoots.slice(indexOfFirstShoot, indexOfLastShoot);
  const totalPages = Math.ceil(filteredShoots.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleShootSelect = (shoot: any) => {
    console.log('Selected shoot:', shoot);
    // Navigate to ShootDetail or open a modal
  };

  const handleUploadMedia = (shoot: any) => {
    console.log('Upload media for shoot:', shoot);
    // Open a media upload modal
  };

  return (
    <Shell className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Shoot History</CardTitle>
            <CardDescription>View all your past and upcoming shoots</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </Button>
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            <Button
              variant={filter === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('scheduled')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'hold' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('hold')}
            >
              On Hold
            </Button>
          </div>
          
          <ShootsList 
            shoots={currentShoots} 
            onSelect={handleShootSelect} 
            onUploadMedia={handleUploadMedia}
            showMedia={true}
          />
          
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`flex h-9 items-center justify-center gap-1 rounded-md border border-input bg-background px-3 text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <Button
                      variant={currentPage === index + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Button>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`flex h-9 items-center justify-center gap-1 rounded-md border border-input bg-background px-3 text-sm ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'text-muted-foreground hover:text-foreground'}`}
                    aria-disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}
