import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Save } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Service = {
  id: string;
  name: string;
  description?: string;
  price: number;
  delivery_time?: number;
  photographer_required?: boolean;
  active: boolean;
  category?: string;
};

type ServiceCategory = {
  id: string;
  name: string;
  display_order: number;
};

export function ServicesTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    delivery_time: '',
    category: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      
      setCategories(data || []);
      if (data && data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching service categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service categories',
        variant: 'destructive',
      });
    }
  };

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (
            id,
            name
          )
        `)
        .order('category');
      
      if (error) throw error;
      
      const mappedServices: Service[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        delivery_time: item.duration,
        active: item.is_active || false,
        category: item.category,
        photographer_required: false
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

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
      const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
      if (!selectedCategoryData) {
        toast({
          title: 'Error',
          description: 'Please select a category',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase
        .from('services')
        .insert([
          {
            name: newService.name,
            description: newService.description,
            price: parseFloat(newService.price),
            duration: parseInt(newService.delivery_time),
            category_id: selectedCategory,
            category: selectedCategoryData.name,
            is_active: true
          }
        ]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Service saved successfully',
      });

      setIsAddDialogOpen(false);
      setNewService({
        name: '',
        description: '',
        price: '',
        delivery_time: '',
        category: '',
      });
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive',
      });
    }
  };

  const filteredServices = selectedCategory 
    ? services.filter(service => service.category === categories.find(cat => cat.id === selectedCategory)?.name)
    : services;

  return (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <Select 
          value={selectedCategory || ''} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <DialogTrigger asChild>
              <Card className="border-2 border-dashed border-muted-foreground/20 h-full flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Add New Service</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    Create a new service for this category
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newService.category} 
                    onValueChange={(value) => setNewService(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
    </div>
  );
}
