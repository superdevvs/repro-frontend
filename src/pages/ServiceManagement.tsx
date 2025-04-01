
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { ServicesList } from '@/components/services/ServicesList';
import { PackagesList } from '@/components/services/PackagesList';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ServiceType, PackageType } from '@/types/services';
import { loadServices, loadPackages, saveServices, savePackages } from '@/data/servicesData';
import { ServiceDialog } from '@/components/services/ServiceDialog';
import { PackageDialog } from '@/components/services/PackageDialog';

const ServiceManagement = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("services");
  const [services, setServices] = useState<ServiceType[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);

  // Check if user is admin
  const isAdmin = role === 'admin' || role === 'superadmin';

  // Load services and packages from localStorage
  useEffect(() => {
    setServices(loadServices());
    setPackages(loadPackages());
  }, []);

  // Handle adding or updating a service
  const handleServiceSave = (service: ServiceType) => {
    if (editingService) {
      // Update existing service
      const updatedServices = services.map(s => 
        s.id === service.id ? service : s
      );
      setServices(updatedServices);
      saveServices(updatedServices);
      toast({
        title: "Service updated",
        description: `${service.name} has been updated successfully.`,
      });
    } else {
      // Add new service
      const newServices = [...services, service];
      setServices(newServices);
      saveServices(newServices);
      toast({
        title: "Service added",
        description: `${service.name} has been added to your services list.`,
      });
    }
    setEditingService(null);
    setIsServiceDialogOpen(false);
  };

  // Handle adding or updating a package
  const handlePackageSave = (pkg: PackageType) => {
    if (editingPackage) {
      // Update existing package
      const updatedPackages = packages.map(p => 
        p.id === pkg.id ? pkg : p
      );
      setPackages(updatedPackages);
      savePackages(updatedPackages);
      toast({
        title: "Package updated",
        description: `${pkg.name} has been updated successfully.`,
      });
    } else {
      // Add new package
      const newPackages = [...packages, pkg];
      setPackages(newPackages);
      savePackages(newPackages);
      toast({
        title: "Package added",
        description: `${pkg.name} has been added to your packages list.`,
      });
    }
    setEditingPackage(null);
    setIsPackageDialogOpen(false);
  };

  // Handle deleting a service
  const handleServiceDelete = (serviceId: string) => {
    const updatedServices = services.filter(s => s.id !== serviceId);
    setServices(updatedServices);
    saveServices(updatedServices);
    toast({
      title: "Service deleted",
      description: "The service has been removed successfully.",
      variant: "destructive",
    });
  };

  // Handle deleting a package
  const handlePackageDelete = (packageId: string) => {
    const updatedPackages = packages.filter(p => p.id !== packageId);
    setPackages(updatedPackages);
    savePackages(updatedPackages);
    toast({
      title: "Package deleted",
      description: "The package has been removed successfully.",
      variant: "destructive",
    });
  };

  // Handle editing a service
  const handleServiceEdit = (service: ServiceType) => {
    setEditingService(service);
    setIsServiceDialogOpen(true);
  };

  // Handle editing a package
  const handlePackageEdit = (pkg: PackageType) => {
    setEditingPackage(pkg);
    setIsPackageDialogOpen(true);
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <PageTransition>
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You do not have permission to view this page.</CardDescription>
            </CardHeader>
          </Card>
        </PageTransition>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Services & Packages</h2>
              <p className="text-muted-foreground">
                Manage all your photography services and packages.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {activeTab === "services" ? (
                <Button onClick={() => {
                  setEditingService(null);
                  setIsServiceDialogOpen(true);
                }}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              ) : (
                <Button onClick={() => {
                  setEditingPackage(null);
                  setIsPackageDialogOpen(true);
                }}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Package
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Individual Services</TabsTrigger>
              <TabsTrigger value="packages">Photography Packages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="mt-4">
              <ServicesList 
                services={services} 
                onEdit={handleServiceEdit} 
                onDelete={handleServiceDelete} 
              />
            </TabsContent>
            
            <TabsContent value="packages" className="mt-4">
              <PackagesList 
                packages={packages} 
                services={services}
                onEdit={handlePackageEdit} 
                onDelete={handlePackageDelete} 
              />
            </TabsContent>
          </Tabs>
        </div>

        <ServiceDialog 
          isOpen={isServiceDialogOpen}
          onClose={() => setIsServiceDialogOpen(false)}
          onSave={handleServiceSave}
          service={editingService}
        />

        <PackageDialog 
          isOpen={isPackageDialogOpen}
          onClose={() => setIsPackageDialogOpen(false)}
          onSave={handlePackageSave}
          package={editingPackage}
          services={services}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default ServiceManagement;
