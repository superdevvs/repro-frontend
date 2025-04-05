
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShootsList } from '@/components/dashboard/ShootsList';
import { useShoots } from '@/context/ShootsContext';
import { CalendarIcon, FilterIcon, SearchIcon } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { formatDateSafe } from '@/utils/formatters';

export function ShootHistory() {
  const { shoots } = useShoots();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const filteredShoots = shoots.filter(shoot => {
    // Filter by status
    if (filter !== 'all' && shoot.status !== filter) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        shoot.location.fullAddress?.toLowerCase().includes(query) ||
        shoot.client.name?.toLowerCase().includes(query) ||
        shoot.photographer.name?.toLowerCase().includes(query) ||
        formatDateSafe(shoot.scheduledDate).toLowerCase().includes(query)
      );
    }
    
    return true;
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
    // Open media upload dialog
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Shoot History</CardTitle>
            <CardDescription>View all past and upcoming property shoots</CardDescription>
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
          <div className="flex flex-col gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by address, client, photographer, or date..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
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
                Scheduled
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
            
            <div className="flex justify-center mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                  </PaginationItem>
                  
                  {/* Display up to 5 page numbers */}
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    // Adjust which 5 pages to show based on current page
                    let pageNum = i + 1;
                    if (currentPage > 3 && totalPages > 5) {
                      pageNum = currentPage - 3 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (5 - i - 1);
                    }
                    
                    return (
                      <PaginationItem key={i}>
                        <Button
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
