
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type ServiceProps = {
  service: {
    id: string;
    name: string;
    description?: string;
    price: number;
    delivery_time?: number;
    photographer_required?: boolean;
    active: boolean;
    category?: string; // Added category property
  };
  onUpdate: () => void;
};

export function ServiceCard({ service, onUpdate }: ServiceProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedService, setEditedService] = useState({ ...service });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setEditedService({
      ...editedService,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setEditedService({
      ...editedService,
      active: checked,
    });
  };

  const handleSaveService = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('services')
        .update({
          name: editedService.name,
          description: editedService.description,
          price: Number(editedService.price),
          duration: Number(editedService.delivery_time),
          is_active: editedService.active,
          category: editedService.category
        })
        .eq('id', service.id);
      
      if (error) throw error;
      
      toast({
        title: 'Service Updated',
        description: 'The service has been updated successfully.',
      });
      
      setIsEditDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Error',
        description: 'Failed to update service. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);
      
      if (error) throw error;
      
      toast({
        title: 'Service Deleted',
        description: 'The service has been deleted successfully.',
      });
      
      setIsDeleteDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(service.price);

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{service.name}</CardTitle>
            <Badge variant={service.active ? "default" : "secondary"}>
              {service.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-muted-foreground text-sm mb-4">
            {service.description || "No description provided"}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Price:</span>
              <span className="font-semibold">{formattedPrice}</span>
            </div>
            
            {service.delivery_time !== undefined && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Delivery Time:</span>
                <span>{service.delivery_time} hours</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Photographer Required:</span>
              <span>
                {service.photographer_required ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-3">
          <div className="flex justify-between w-full">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                name="name"
                value={editedService.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={editedService.description || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={editedService.price}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery_time">Delivery Time (hours)</Label>
                <Input
                  id="delivery_time"
                  name="delivery_time"
                  type="number"
                  value={editedService.delivery_time || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="photographer_required" className="cursor-pointer">
                Photographer Required
              </Label>
              <Switch
                id="photographer_required"
                name="photographer_required"
                checked={editedService.photographer_required || false}
                onCheckedChange={(checked) => 
                  setEditedService({...editedService, photographer_required: checked})
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="active" className="cursor-pointer">
                Active
              </Label>
              <Switch
                id="active"
                checked={editedService.active}
                onCheckedChange={handleSwitchChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveService}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the service "{service.name}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteService}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete Service"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
