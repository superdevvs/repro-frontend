import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Save } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { CategorySelect } from '@/components/settings/CategorySelect';
import { IconPicker, getIconComponent } from './IconPicker';
import { useServiceCategories } from '@/hooks/useServiceCategories';
import API_ROUTES from '@/lib/api';

type Service = {
  id: string;
  name: string;
  description?: string;
  price: string;
  delivery_time?: string;
  photographer_required?: boolean;
  active: boolean;
  category?: string;
};

export function ServicesTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    delivery_time: '',
    category: '',
    icon: '',
  });
  const { toast } = useToast();
  // const { data: categories, isLoading: categoriesLoading } = useServiceCategories();
  const { data: categories, isLoading: categoriesLoading, refetch: refetchCategories } = useServiceCategories();

  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  useEffect(() => {
    fetchServices();

    // Set default selected category when categories are loaded
    if (categories && categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ROUTES.services.all);
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      const mappedServices: Service[] = data.data.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        delivery_time: item.delivery_time,
        // active: item.is_active || false,
        category: item.category.name || '', // adjust this based on your actual API response
        photographer_required: false,
      }));

      setServices(mappedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  // const handleCategoryChange = (categoryId: string) => {
  //   console.log('Selected category:', categoryId);
  //   setSelectedCategory(categoryId);
  // };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveService = async () => {
    try {
      const selectedCategoryData = categories?.find(cat => cat.id == newService.category);
      if (!selectedCategoryData) {
        toast({
          title: 'Error',
          description: 'Please select a category',
          variant: 'destructive',
        });
        return;
      }

      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error("No auth token found in localStorage");
      }

      const response = await fetch(API_ROUTES.services.create, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newService.name,
          description: newService.description,
          price: parseFloat(newService.price),
          delivery_time: parseInt(newService.delivery_time),
          category_id: newService.category, // Ensure this matches your API's expected field
          icon: newService.icon,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save service');
      }

      const result = await response.json();

      toast({
        title: 'Success',
        description: result.message || 'Service saved successfully',
      });

      setIsAddDialogOpen(false);
      setNewService({
        name: '',
        description: '',
        price: '',
        delivery_time: '',
        category: '',
        icon: '',
      });
      fetchServices(); // Make sure fetchServices is also updated to use your custom API
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save service',
        variant: 'destructive',
      });
    }
  };


  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({ title: 'Name required', description: 'Please enter a category name.', variant: 'destructive' });
      return;
    }

    try {
      setIsCreatingCategory(true);

      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No auth token found');

      const res = await fetch(API_ROUTES.categories.create, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          name: newCategoryName.trim(),
          icon: newCategoryIcon 
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.message || 'Failed to create category');
      }

      const data = await res.json(); // assume returns { data: { id, name, ... }, message? }

      // refetch list so new category appears
      await refetchCategories?.();

      // Select the newly created category if id available
      const newId = data?.data?.id;
      if (newId) setSelectedCategory(newId);

      toast({ title: 'Category created', description: data.message || 'New category has been added.' });
      setNewCategoryName('');
      setNewCategoryIcon('');
      setIsAddCategoryOpen(false);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Could not create category.', variant: 'destructive' });
    } finally {
      setIsCreatingCategory(false);
    }
  };



  const filteredServices = selectedCategory
    ? services.filter(service => service.category === categories?.find(cat => cat.id === selectedCategory)?.name)
    : services;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {categoriesLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories?.map(category => {
              const Icon = category.icon ? getIconComponent(category.icon) : null;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category.id)}
                  className="rounded-full transition-all gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {category.name}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              className="rounded-full border-dashed border-muted-foreground/50 hover:border-primary hover:text-primary gap-2"
              onClick={() => setIsAddCategoryOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onUpdate={fetchServices}
            />
          ))}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <Card className="border-2 border-dashed border-muted-foreground/20 h-full flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setIsAddDialogOpen(true)}>
              <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Add New Service</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Create a new service for this category
                </p>
              </CardContent>
            </Card>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <CategorySelect
                    value={newService.category}
                    onChange={(value) => {
                      setNewService(prev => ({ ...prev, category: value }));
                    }}

                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newService.name}
                    onChange={handleInputChange}
                    placeholder="e.g., HDR Photos"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newService.description}
                    onChange={handleInputChange}
                    placeholder="Service description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <IconPicker
                    value={newService.icon}
                    onChange={(value) => setNewService(prev => ({ ...prev, icon: value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={newService.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery_time">Delivery Time (hours)</Label>
                    <Input
                      id="delivery_time"
                      name="delivery_time"
                      type="number"
                      value={newService.delivery_time}
                      onChange={handleInputChange}
                      placeholder="24"
                    />
                  </div>
                </div>
                {/* <div className="space-y-2">
                  <CategorySelect
                    value={newService.category}
                    onChange={(value) => {
                      setNewService(prev => ({ ...prev, category: value }));
                    }}

                  />
                </div> */}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveService}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Add New Category Dialog (place outside the grid, before the final closing </div>) */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>

            <div className="space-y-3 py-2">
              <Label htmlFor="new-category-name">Category name</Label>
              <Input
                id="new-category-name"
                placeholder="e.g., Floor Plans"
                value={newCategoryName}
                autoFocus
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateCategory();
                }}
              />
              
              <div className="space-y-2">
                <Label>Icon (optional)</Label>
                <IconPicker
                  value={newCategoryIcon}
                  onChange={setNewCategoryIcon}
                />
              </div>
            </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={isCreatingCategory}>
              {isCreatingCategory ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}