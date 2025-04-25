
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Download, Search, Filter } from "lucide-react";
import { Role } from "@/components/auth/AuthProvider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface AccountsHeaderProps {
  onAddAccount: () => void;
  onExport: () => void;
  onSearch: (query: string) => void;
  onFilterChange: (role: Role | 'all') => void;
  selectedFilter: Role | 'all';
}

export function AccountsHeader({
  onAddAccount,
  onExport,
  onSearch,
  onFilterChange,
  selectedFilter
}: AccountsHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="space-y-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">User Accounts</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and organize your team members
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onExport} className="h-9">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={onAddAccount} size="sm" className="h-9 bg-[#6E59A5] hover:bg-[#9b87f5] dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB]">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 h-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <ScrollArea className="w-full sm:w-auto">
              <div className="flex gap-2 pb-2 sm:pb-0">
                <Button 
                  variant={selectedFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange('all')}
                  className="h-9 whitespace-nowrap"
                >
                  All Accounts
                </Button>
                <Button 
                  variant={selectedFilter === 'admin' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange('admin')}
                  className="h-9 whitespace-nowrap"
                >
                  Admins
                </Button>
                <Button 
                  variant={selectedFilter === 'photographer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange('photographer')}
                  className="h-9 whitespace-nowrap"
                >
                  Photographers
                </Button>
                <Button 
                  variant={selectedFilter === 'client' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange('client')}
                  className="h-9 whitespace-nowrap"
                >
                  Clients
                </Button>
                <Button 
                  variant={selectedFilter === 'editor' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onFilterChange('editor')}
                  className="h-9 whitespace-nowrap"
                >
                  Editors
                </Button>
              </div>
              <ScrollBar orientation="horizontal" className="invisible sm:visible" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
