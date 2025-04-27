
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Plus, Save } from 'lucide-react';
import { ServiceCard } from './ServiceCard';
import { CategorySelect } from '../settings/CategorySelect';
import { useServices } from '@/hooks/useServices';
import { useServiceCategories } from '@/hooks/useServiceCategories';

export function ServicesTab() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: services, isLoading, refetch: refetchServices } = useServices();
  const { data: categories, isLoading: categoriesLoading } = useServiceCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    delivery_time: '',
    category: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveService = async () => {
    try {
      const selectedCategoryData = categories?.find(cat => cat.id === newService.category);
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
            category_id: newService.category,
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
      refetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {services?.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onUpdate={() => refetchServices()}
              />
            ))}
            
            <Card className="border-2 border-dashed border-muted-foreground/20 h-full flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setIsAddDialogOpen(true)}>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Add New Service</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Create a new service
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <CategorySelect 
                value={newService.category}
                onChange={(value) => setNewService(prev => ({ ...prev, category: value }))}
              />
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
  );
}
