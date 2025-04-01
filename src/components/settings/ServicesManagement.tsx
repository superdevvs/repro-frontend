
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  PlusIcon, 
  EditIcon, 
  Trash2Icon, 
  SaveIcon, 
  XIcon,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getServiceCategories, getServicesList } from '@/data/servicesData';

interface ServiceType {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
}

export function ServicesManagement() {
  const { toast } = useToast();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [categories, setCategories] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Photos',
    price: '',
    description: ''
  });
  
  // Initialize services from local storage or convert from existing service list
  useEffect(() => {
    const storedServices = localStorage.getItem('servicesData');
    
    if (storedServices) {
      setServices(JSON.parse(storedServices));
    } else {
      // Convert from availableServices
      const servicesList = getServicesList();
      const serviceCategories = getServiceCategories();
      
      // Create a category lookup map
      const categoryMap: Record<string, string> = {};
      
      Object.entries(serviceCategories).forEach(([category, services]) => {
        services.forEach(service => {
          categoryMap[service] = category;
        });
      });
      
      // Convert to ServiceType format with default prices and descriptions
      const initialServices: ServiceType[] = servicesList.map((name, index) => ({
        id: `service-${index}`,
        name,
        category: categoryMap[name] || 'Other',
        price: Math.floor(Math.random() * 250) + 50, // Random price between 50-300
        description: `Professional ${name} service for real estate marketing.`
      }));
      
      setServices(initialServices);
      localStorage.setItem('servicesData', JSON.stringify(initialServices));
    }
    
    // Set categories
    setCategories(getServiceCategories());
  }, []);
  
  // Filter services based on active tab and search term
  const filteredServices = services.filter(service => {
    const matchesCategory = activeTab === 'all' || service.category === activeTab;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Get all categories currently in use
  const allCategories = ['all', ...new Set(services.map(service => service.category))];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? value.replace(/[^0-9.]/g, '') : value
    }));
  };
  
  const handleAddService = () => {
    setIsEditing(false);
    setCurrentService(null);
    setFormData({
      name: '',
      category: 'Photos',
      price: '',
      description: ''
    });
    setDialogOpen(true);
  };
  
  const handleEditService = (service: ServiceType) => {
    setIsEditing(true);
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      price: service.price.toString(),
      description: service.description
    });
    setDialogOpen(true);
  };
  
  const handleDeleteService = (serviceId: string) => {
    const updatedServices = services.filter(service => service.id !== serviceId);
    setServices(updatedServices);
    localStorage.setItem('servicesData', JSON.stringify(updatedServices));
    
    toast({
      title: "Service Deleted",
      description: "The service has been removed successfully.",
      variant: "destructive",
    });
  };
  
  const handleSubmit = () => {
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the service.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.price) {
      toast({
        title: "Missing Information",
        description: "Please provide a price for the service.",
        variant: "destructive",
      });
      return;
    }
    
    const newService: ServiceType = {
      id: isEditing && currentService ? currentService.id : `service-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description || `Professional ${formData.name} service for real estate marketing.`
    };
    
    let updatedServices: ServiceType[];
    
    if (isEditing && currentService) {
      // Edit existing service
      updatedServices = services.map(service => 
        service.id === currentService.id ? newService : service
      );
      
      toast({
        title: "Service Updated",
        description: `${newService.name} has been updated successfully.`,
      });
    } else {
      // Add new service
      updatedServices = [...services, newService];
      
      toast({
        title: "Service Added",
        description: `${newService.name} has been added successfully.`,
      });
    }
    
    setServices(updatedServices);
    localStorage.setItem('servicesData', JSON.stringify(updatedServices));
    setDialogOpen(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <CardTitle>Services Management</CardTitle>
          <Button onClick={handleAddService} size="sm" className="gap-1">
            <PlusIcon className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex flex-wrap">
                {allCategories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map(service => (
              <Card key={service.id} className="overflow-hidden border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-4 border-b border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{service.name}</h3>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {service.category}
                        </Badge>
                      </div>
                      <span className="font-bold text-lg">${service.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex divide-x divide-border">
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-none h-10" 
                      onClick={() => handleEditService(service)}
                    >
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="flex-1 rounded-none h-10 text-destructive hover:text-destructive" 
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredServices.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No services found.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Service' : 'Add New Service'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter service name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.category}
                onChange={handleInputChange}
              >
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter service description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? 'Update Service' : 'Add Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
