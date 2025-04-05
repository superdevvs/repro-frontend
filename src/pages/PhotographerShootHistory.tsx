import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Shell } from "@/components/layout/Shell";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { formatDateSafe, ensureDateString } from '@/utils/formatters';
import { useShoots } from '@/context/ShootsContext';

export function PhotographerShootHistory() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();
  const { shoots, loading, error } = useShoots();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Get photographer ID from URL params
  const photographerId = searchParams.get("photographerId");

  // Filter shoots by photographer ID
  const photographerShoots = React.useMemo(() => {
    if (!photographerId) return [];
    return shoots.filter(shoot => shoot.photographer?.id === photographerId);
  }, [shoots, photographerId]);

  // Filter shoots by search query
  const filteredShoots = React.useMemo(() => {
    return photographerShoots.filter(shoot => {
      const address = shoot.location?.fullAddress || "";
      const clientName = shoot.client?.name || "";
      return address.toLowerCase().includes(searchQuery.toLowerCase()) ||
             clientName.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [photographerShoots, searchQuery]);

  // Paginate the filtered shoots
  const paginatedShoots = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredShoots.slice(startIndex, endIndex);
  }, [filteredShoots, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredShoots.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading shoot history...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Shell>
      <div className="md:flex items-center justify-between space-y-2 md:space-y-0">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Shoot History
          </h2>
          <p className="text-sm text-muted-foreground">
            View a list of all shoots assigned to this photographer.
          </p>
        </div>
        <Input
          type="search"
          placeholder="Search shoots..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Shoot List</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedShoots.map((shoot) => (
                  <TableRow key={shoot.id}>
                    <td>{formatDateSafe(shoot.scheduledDate)}</td>
                    <td>{shoot.location?.fullAddress}</td>
                    <td>{shoot.client?.name}</td>
                    <td>
                      <Badge variant="secondary">{shoot.status}</Badge>
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          {filteredShoots.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No shoots found.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <Pagination className="w-full mt-4">
          <PaginationContent>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink href="#" onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {currentPage > 3 && <PaginationEllipsis />}
            {Array.from({ length: Math.min(5, totalPages) })
              .map((_, i) => {
                const pageNumber = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                if (pageNumber > totalPages) return null;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            {currentPage < totalPages - 2 && <PaginationEllipsis />}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </PaginationContent>
        </Pagination>
      )}
    </Shell>
  );
}
