
import React from 'react';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { PlusIcon, FileTextIcon, Download, UsersIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface AccountingHeaderProps {
  onCreateInvoice: () => void;
  onCreateBatch?: () => void;
}

export function AccountingHeader({ onCreateInvoice, onCreateBatch }: AccountingHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Accounting</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center gap-2">
          <FileTextIcon className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-medium">Accounting</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your finances, invoices, and payments
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <span>CSV</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Excel</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Invoice
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onCreateInvoice}>
              <PlusIcon className="h-4 w-4 mr-2" />
              <span>Single Invoice</span>
            </DropdownMenuItem>
            {onCreateBatch && (
              <DropdownMenuItem onClick={onCreateBatch}>
                <UsersIcon className="h-4 w-4 mr-2" />
                <span>Batch Invoices</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
