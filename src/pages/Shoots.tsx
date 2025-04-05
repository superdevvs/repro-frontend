import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShootData } from '@/types/shoots';
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Edit, Copy, Trash, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useShoots } from '@/context/ShootsContext';
import { Link, useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateSafe } from '@/utils/formatters';
import { TimeRangeFilter } from '@/components/dashboard/TimeRangeFilter';
import { TimeRange } from '@/utils/dateUtils';
import { ShootActionsDialog } from '@/components/dashboard/ShootActionsDialog';
import { MessageDialog } from '@/components/dashboard/MessageDialog';
import { useToast } from '@/hooks/use-toast';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useIsMobile } from '@/hooks/use-mobile';
import { stringifyId, ensureValidId } from '@/utils/idUtils';
import { toStringId } from '@/utils/formatters';

export function Shoots() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShoot, setSelectedShoot] = useState<ShootData | null>(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const { shoots, loading, error, deleteShoot, getClientShootsByStatus } = useShoots();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleActionsOpen = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsActionsOpen(true);
  };

  const handleActionsClose = () => {
    setIsActionsOpen(false);
  };

  const handleMessageOpen = (shoot: ShootData) => {
    setSelectedShoot(shoot);
    setIsMessageOpen(true);
  };

  const handleMessageClose = () => {
    setIsMessageOpen(false);
  };

  const handleDelete = (id: string | number) => {
    const shootId = toStringId(id);
    deleteShoot(shootId);
    toast({
      title: "Shoot deleted",
      description: `Shoot #${shootId} has been permanently deleted.`,
    });
  };

  const filteredShoots = shoots?.filter(shoot =>
    shoot.location.fullAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shoot.client.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedShoots = () => {
    if (!filteredShoots) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredShoots.slice(startIndex, endIndex);
  };

  const totalPages = filteredShoots ? Math.ceil(filteredShoots.length / pageSize) : 0;

  const shootCountByStatus = (status: string): number => {
    if (!getClientShootsByStatus) return 0;
    return getClientShootsByStatus(status).length;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Shoots</CardTitle>
            <CardDescription>Loading shoots...</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell className="text-right"><Skeleton className="w-24" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Shoots</CardTitle>
            <CardDescription>Error: {error.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Failed to load shoots. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Shoots</CardTitle>
          <CardDescription>
            Manage your photo shoots and view details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <Input
              type="search"
              placeholder="Search shoots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:w-1/3"
            />
            <div className="flex-grow"></div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedShoots().map((shoot) => {
                // Use toStringId for consistent string conversion
                const shootId = toStringId(shoot.id);

                return (
                  <TableRow key={shootId}>
                    <TableCell>{formatDateSafe(shoot.scheduledDate)}</TableCell>
                    <TableCell>{shoot.location.fullAddress}</TableCell>
                    <TableCell>{shoot.client.name}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/shoot/${shootId}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleMessageOpen(shoot)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Message</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleActionsOpen(shoot)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Actions</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDelete(shoot.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between pt-4">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                />
                {currentPage > 2 && (
                  <PaginationItem>
                    <PaginationLink href="#" onClick={() => setCurrentPage(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                )}
                {currentPage > 3 && <PaginationEllipsis />}
                {Array.from({ length: Math.min(5, totalPages) })
                  .map((_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === currentPage}
                          onClick={() => setCurrentPage(pageNumber)}
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
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                />
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
      
      <ShootActionsDialog 
        shoot={selectedShoot}
        isOpen={isActionsOpen}
        onClose={handleActionsClose}
      />
      
      <MessageDialog
        shoot={selectedShoot}
        isOpen={isMessageOpen}
        onClose={handleMessageClose}
      />
    </div>
  );
}
