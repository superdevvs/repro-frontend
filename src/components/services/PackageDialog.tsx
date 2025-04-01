
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from '@/components/ui/form';
import { ServiceType, PackageType } from '@/types/services';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Package name must be at least 2 characters' }),
  description: z.string().min(2, { message: 'Please provide a description' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  services: z.array(z.string()).min(1, { message: 'Select at least one service' }),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PackageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pkg: PackageType) => void;
  package: PackageType | null;
  services: ServiceType[];
}

export function PackageDialog({ isOpen, onClose, onSave, package: pkg, services }: PackageDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: pkg ? {
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      services: pkg.services,
      featured: pkg.featured || false,
    } : {
      name: '',
      description: '',
      price: 0,
      services: [],
      featured: false,
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSave({
      id: pkg?.id || uuidv4(),
      name: values.name,
      description: values.description,
      price: values.price,
      services: values.services,
      featured: values.featured,
    });
  };

  // Group services by category
  const servicesByCategory = services.reduce<Record<string, ServiceType[]>>((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{pkg ? 'Edit Package' : 'Add New Package'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Premium Package" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What's included in this package?" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-end space-x-2 space-y-0 rounded-md mt-8">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Package</FormLabel>
                      <FormDescription>
                        Show this package prominently
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel>Included Services</FormLabel>
                  <ScrollArea className="h-56 rounded-md border p-4">
                    <div className="space-y-6">
                      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-medium">{category}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {categoryServices.map((service) => (
                              <FormField
                                key={service.id}
                                control={form.control}
                                name="services"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={service.id}
                                      className="flex flex-row items-start space-x-2 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(service.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, service.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== service.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        {service.name} (${service.price})
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {pkg ? 'Update' : 'Add'} Package
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
