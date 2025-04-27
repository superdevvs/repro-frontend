
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, PlusCircle, Edit, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ServiceCard } from './ServiceCard';
import { useAuth } from '@/components/auth/AuthProvider';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  delivery_time: number;
  photographer_required: boolean;
  active: boolean;
  category?: string;
};

type ServiceCategory = {
  id: string;
  name: string;
};

export function ServicesTab() {
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('name');
      
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
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setServices(data || []);
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

  const filteredServices = selectedCategory 
    ? services.filter(service => service.category === selectedCategory)
    : services;

  return (
    <div className="space-y-6">
      <div className="text-center mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold mb-2">Select a service category to add/remove/modify services that your company provides.</h2>
        <p className="text-muted-foreground mb-4">
          Services are not required, but they help you save time when scheduling appointments.
        </p>
        <Button variant="link" className="text-blue-500">
          Want to change the service category order?
        </Button>
      </div>
      
      <div className="flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsEditingPricing(!isEditingPricing)}
              >
                <HelpCircle size={16} />
                Bulk Edit Pricing
                <HelpCircle size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quickly update pricing for multiple services</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="max-w-md mx-auto">
        <Label htmlFor="category-select" className="mb-1 block">Category</Label>
        <Select 
          value={selectedCategory || ''} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category-select" className="w-full">
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
                  <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
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
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input id="service-name" placeholder="e.g., HDR Photos" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-description">Description</Label>
                  <Input id="service-description" placeholder="Service description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service-price">Price</Label>
                    <Input id="service-price" type="number" placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="delivery-time">Delivery Time (hours)</Label>
                    <Input id="delivery-time" type="number" placeholder="24" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Service</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}
