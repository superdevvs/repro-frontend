
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CreditCard, 
  Download, 
  Edit, 
  Eye, 
  MoreHorizontal, 
  SendIcon, 
  Upload, 
  FileText,
  ChevronRight
} from "lucide-react";
import { ShootData } from '@/types/shoots';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from "@/components/ui/card";

interface ShootsListProps {
  shoots: ShootData[];
  onViewDetails: (shoot: ShootData) => void;
}

export function ShootsList({ shoots, onViewDetails }: ShootsListProps) {
  const { role } = useAuth();
  const isMobile = useIsMobile();
  const isAdmin = ['admin', 'superadmin'].includes(role);
  const isPhotographer = role === 'photographer';
  
  const getStatusBadge = (status: ShootData['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'hold':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Hold</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MM/dd/yyyy');
  };
  
  const getPaymentStatus = (shoot: ShootData) => {
    if (!shoot.payment.totalPaid) return <Badge variant="outline">Unpaid</Badge>;
    if (shoot.payment.totalPaid < shoot.payment.totalQuote) {
      return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Partial</Badge>;
    }
    return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>;
  };
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        {shoots.length > 0 ? (
          shoots.map((shoot) => (
            <Card key={shoot.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{shoot.client.name}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(shoot.scheduledDate)}</div>
                    </div>
                    <div>{getStatusBadge(shoot.status)}</div>
                  </div>
                  
                  <div className="text-sm truncate">{shoot.location.fullAddress}</div>
                  
                  <div className="flex justify-between items-center border-t pt-3 mt-3">
                    <div className="text-xs text-muted-foreground">
                      {shoot.photographer.name}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => onViewDetails(shoot)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No shoots found.
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Photographer</TableHead>
            {role === 'superadmin' && <TableHead>Payment</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shoots.length > 0 ? (
            shoots.map((shoot) => (
              <TableRow key={shoot.id}>
                <TableCell className="font-medium">{formatDate(shoot.scheduledDate)}</TableCell>
                <TableCell>{shoot.client.name}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={shoot.location.fullAddress}>
                  {shoot.location.fullAddress}
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={shoot.services.join(', ')}>
                  {shoot.services.length > 0 ? shoot.services.join(', ') : 'N/A'}
                </TableCell>
                <TableCell>{shoot.photographer.name}</TableCell>
                {role === 'superadmin' && (
                  <TableCell>{getPaymentStatus(shoot)}</TableCell>
                )}
                <TableCell>{getStatusBadge(shoot.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetails(shoot)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      
                      {isAdmin && (
                        <>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Shoot
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <SendIcon className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {isPhotographer && (
                        <>
                          <DropdownMenuItem>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Media
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {role === 'superadmin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Process Payment
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {shoot.status === 'completed' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Media
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={role === 'superadmin' ? 8 : 7} className="h-24 text-center">
                No shoots found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
