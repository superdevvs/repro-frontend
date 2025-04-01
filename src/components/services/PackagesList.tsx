
import React, { useState } from 'react';
import { PackageType, ServiceType } from '@/types/services';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, EditIcon, Trash2Icon, StarIcon } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PackagesListProps {
  packages: PackageType[];
  services: ServiceType[];
  onEdit: (pkg: PackageType) => void;
  onDelete: (packageId: string) => void;
}

export function PackagesList({ packages, services, onEdit, onDelete }: PackagesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter packages
  const filteredPackages = packages.filter(pkg => {
    return pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get service names for a package
  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => {
      const service = services.find(s => s.id === id);
      return service ? service.name : 'Unknown Service';
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search packages..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.length > 0 ? (
          filteredPackages.map((pkg) => (
            <Card key={pkg.id} className={pkg.featured ? 'border-primary' : ''}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  {pkg.featured && (
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                  )}
                </div>
                <div className="font-bold text-2xl">${pkg.price.toFixed(2)}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{pkg.description}</p>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Included Services:</div>
                  <div className="flex flex-wrap gap-2">
                    {getServiceNames(pkg.services).map((serviceName, index) => (
                      <Badge key={index} variant="outline">{serviceName}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-0">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(pkg)}
                >
                  <EditIcon className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2Icon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the package "{pkg.name}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(pkg.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            No packages found. Create a new package to get started.
          </div>
        )}
      </div>
    </div>
  );
}
