
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Download, Search } from "lucide-react";
import { Role } from "@/components/auth/AuthProvider";

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
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <h1 className="text-2xl font-bold">User Accounts</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex justify-start space-x-1 overflow-auto pb-1">
          <Button 
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('all')}
          >
            All
          </Button>
          <Button 
            variant={selectedFilter === 'admin' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('admin')}
          >
            Admins
          </Button>
          <Button 
            variant={selectedFilter === 'photographer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('photographer')}
          >
            Photographers
          </Button>
          <Button 
            variant={selectedFilter === 'client' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('client')}
          >
            Clients
          </Button>
          <Button 
            variant={selectedFilter === 'editor' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterChange('editor')}
          >
            Editors
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
          <Button onClick={onAddAccount}>
            <PlusCircle className="mr-1 h-4 w-4" /> Add Account
          </Button>
        </div>
      </div>
    </div>
  );
}
