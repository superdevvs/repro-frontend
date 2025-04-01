
import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ImportShootsDialog } from '@/components/dashboard/ImportShootsDialog';
import { Upload, Save, Settings2, User, Bell, Paintbrush, Package, CreditCard, Building, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ServicesList } from '@/components/services/ServicesList';
import { PackagesList } from '@/components/services/PackagesList';
import { loadServices, loadPackages, saveServices, savePackages } from '@/data/servicesData';
import { ServiceType, PackageType } from '@/types/services';
import { ServiceDialog } from '@/components/services/ServiceDialog';
import { PackageDialog } from '@/components/services/PackageDialog';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceType | null>(null);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [activeServicesTab, setActiveServicesTab] = useState("services");
  
  // Load services and packages from localStorage
  useEffect(() => {
    setServices(loadServices());
    setPackages(loadPackages());
  }, []);
  
  const handleImportClick = () => {
    setIsImportDialogOpen(true);
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your changes have been successfully saved.",
    });
  };

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

  // Navigate to dedicated service management page
  const handleManageServicesClick = () => {
    navigate('/services');
  };
  
  return (
    <DashboardLayout>
      <PageTransition>
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import Shoots
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:grid-cols-6">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="flex items-center space-x-2">
                <Building className="h-4 w-4" />
                <span>Business</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Services</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Billing</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Paintbrush className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Profile Settings Tab */}
            <TabsContent value="profile" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium">Personal Information</h3>
                  <Button onClick={handleSaveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="Your full name" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Your email" defaultValue="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Your phone number" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input id="title" placeholder="Your job title" defaultValue="Lead Photographer" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Business Settings Tab */}
            <TabsContent value="business" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium">Business Information</h3>
                  <Button onClick={handleSaveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" placeholder="Your company" defaultValue="REPro Photography" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" placeholder="Your website" defaultValue="https://repro-photography.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Input id="address" placeholder="Street address" defaultValue="123 Main St" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" defaultValue="New York" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="State" defaultValue="NY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" placeholder="Zip code" defaultValue="10001" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID / EIN</Label>
                      <Input id="taxId" placeholder="Tax ID" defaultValue="12-3456789" />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Services & Packages Tab */}
            <TabsContent value="services" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium">Photography Services & Packages</h3>
                  <div className="flex space-x-2">
                    <Button onClick={handleManageServicesClick} variant="outline">
                      <Settings2 className="mr-2 h-4 w-4" />
                      Advanced Management
                    </Button>
                    {activeServicesTab === "services" ? (
                      <Button onClick={() => {
                        setEditingService(null);
                        setIsServiceDialogOpen(true);
                      }}>
                        <Package className="mr-2 h-4 w-4" />
                        Add Service
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        setEditingPackage(null);
                        setIsPackageDialogOpen(true);
                      }}>
                        <Package className="mr-2 h-4 w-4" />
                        Add Package
                      </Button>
                    )}
                  </div>
                </div>
                <Separator className="my-4" />
                
                <Tabs value={activeServicesTab} onValueChange={setActiveServicesTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
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
              </Card>
            </TabsContent>
            
            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium">Billing & Subscription</h3>
                  <Button onClick={handleSaveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Current Plan: Professional</h4>
                        <p className="text-sm text-muted-foreground">Your plan renews on October 1, 2023</p>
                      </div>
                      <Button variant="outline">Change Plan</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Payment Method</h4>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="h-10 w-16 bg-muted/50 rounded mr-4"></div>
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/24</p>
                        </div>
                      </div>
                      <Button variant="ghost">Edit</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Billing Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingName">Name</Label>
                        <Input id="billingName" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingEmail">Email</Label>
                        <Input id="billingEmail" defaultValue="billing@example.com" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium">Notification Preferences</h3>
                  <Button onClick={handleSaveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New Booking Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive an email when a new shoot is booked</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Shoot Reminders</p>
                          <p className="text-sm text-muted-foreground">Receive reminders about upcoming shoots</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Invoice & Payment Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications about invoices and payments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">System Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">In-App Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive notifications in the dashboard</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive important updates via text message</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Updates</p>
                          <p className="text-sm text-muted-foreground">Receive news about product updates and offers</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-4 mt-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium">Appearance Settings</h3>
                  <Button onClick={handleSaveSettings} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
                <Separator className="my-4" />
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Enable dark mode for the interface</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Compact View</p>
                        <p className="text-sm text-muted-foreground">Use a more compact layout</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show Graphic Elements</p>
                        <p className="text-sm text-muted-foreground">Display decorative graphics in the interface</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Brand Colors</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary rounded-l-md"></div>
                          <Input id="primaryColor" defaultValue="#0088CC" className="rounded-l-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondaryColor">Secondary Color</Label>
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-secondary rounded-l-md"></div>
                          <Input id="secondaryColor" defaultValue="#6C757D" className="rounded-l-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Dialogs */}
        <ImportShootsDialog 
          isOpen={isImportDialogOpen}
          onClose={() => setIsImportDialogOpen(false)}
        />
        
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

export default Settings;
