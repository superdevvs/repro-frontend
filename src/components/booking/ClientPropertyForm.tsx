
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';
import { 
  Building2, 
  Home, 
  PlusCircle, 
  Search, 
  User 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

// Create two different schemas based on account type
const clientAccountPropertyFormSchema = z.object({
  propertyAddress: z.string().min(1, "Address is required"),
  propertyCity: z.string().min(1, "City is required"),
  propertyState: z.string().min(1, "State is required"),
  propertyZip: z.string().min(1, "ZIP code is required"),
  propertyType: z.enum(["residential", "commercial"]),
  propertyInfo: z.string().optional(),
  selectedPackage: z.string().min(1, "Please select a package")
});

const adminPropertyFormSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  propertyAddress: z.string().min(1, "Address is required"),
  propertyCity: z.string().min(1, "City is required"),
  propertyState: z.string().min(1, "State is required"),
  propertyZip: z.string().min(1, "ZIP code is required"),
  propertyType: z.enum(["residential", "commercial"]),
  propertyInfo: z.string().optional(),
  selectedPackage: z.string().min(1, "Please select a package")
});

const packages: PackageOption[] = [
  { id: '1', name: 'Basic', description: 'Photos only', price: 150 },
  { id: '2', name: 'Standard', description: 'Photos + Floor Plans', price: 250 },
  { id: '3', name: 'Premium', description: 'Photos + Video + Floor Plans', price: 350 },
  { id: '4', name: 'Luxury', description: 'Photos + Video + 3D Tour + Floor Plans', price: 500 },
];

type ClientPropertyFormProps = {
  onComplete: (data: any) => void;
  initialData: {
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientCompany: string;
    propertyType: 'residential' | 'commercial';
    propertyAddress: string;
    propertyCity: string;
    propertyState: string;
    propertyZip: string;
    propertyInfo: string;
    selectedPackage?: string;
  };
  isClientAccount?: boolean;
};

export const ClientPropertyForm = ({ onComplete, initialData, isClientAccount = false }: ClientPropertyFormProps) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const storedClients = localStorage.getItem('clientsData');
    return storedClients ? JSON.parse(storedClients) : initialClientsData;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  const navigate = useNavigate();
  
  // Use the appropriate schema based on account type
  const formSchema = isClientAccount ? clientAccountPropertyFormSchema : adminPropertyFormSchema;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      ...(isClientAccount ? {} : { clientId: initialData.clientId || '' }),
      propertyAddress: initialData.propertyAddress || '',
      propertyCity: initialData.propertyCity || '',
      propertyState: initialData.propertyState || '',
      propertyZip: initialData.propertyZip || '',
      propertyType: initialData.propertyType || 'residential',
      propertyInfo: initialData.propertyInfo || '',
      selectedPackage: initialData.selectedPackage || '',
    },
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedClient = clients.find(client => client.id === form.watch('clientId'));

  const handleSubmit = (data: any) => {
    // For client accounts, pass along the existing clientId
    if (isClientAccount) {
      onComplete({
        ...data,
        clientId: initialData.clientId,
        clientName: initialData.clientName,
        clientEmail: initialData.clientEmail,
        clientPhone: initialData.clientPhone,
        clientCompany: initialData.clientCompany,
      });
    } else {
      onComplete({
        ...data,
        clientName: selectedClient?.name || '',
        clientEmail: selectedClient?.email || '',
        clientPhone: selectedClient?.phone || '',
        clientCompany: selectedClient?.company || '',
      });
    }
  };

  const navigateToNewClient = () => {
    navigate('/clients/new?returnToBooking=true');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Client Selection - Only show for admin/non-client accounts */}
        {!isClientAccount && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            
            <div className="relative">
              <div className="flex mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search clients..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="ml-2"
                  onClick={navigateToNewClient}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Client
                </Button>
              </div>

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 max-h-[200px] overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                              field.value === client.id
                                ? "bg-primary/10 border-primary"
                                : "bg-card hover:bg-accent/50"
                            }`}
                            onClick={() => form.setValue("clientId", client.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  field.value === client.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium leading-none">
                                  {client.name}
                                </div>
                                {client.company && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {client.company}
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground mt-1.5">
                                  {client.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-6 text-center text-muted-foreground">
                          No clients found. Try a different search or create a new client.
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator className="my-6" />
          </div>
        )}

        {/* Property Information */}
        <div className="pt-2">
          {!isClientAccount && <Separator className="my-6" />}
          <h3 className="text-lg font-medium mb-4">Property Details</h3>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="residential" id="residential" />
                        <Label htmlFor="residential" className="flex items-center cursor-pointer">
                          <Home className="h-4 w-4 mr-2" />
                          Residential
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial" className="flex items-center cursor-pointer">
                          <Building2 className="h-4 w-4 mr-2" />
                          Commercial
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="propertyCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyZip"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-1 col-span-2">
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="propertyInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Gate code, access instructions, special requirements, etc." 
                        className="resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Package Selection */}
        <div className="pt-2">
          <Separator className="my-6" />
          <h3 className="text-lg font-medium mb-4">Package Selection</h3>
          
          <FormField
            control={form.control}
            name="selectedPackage"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-4 border rounded-md cursor-pointer transition-colors ${
                        field.value === pkg.id
                          ? "bg-primary/10 border-primary"
                          : "bg-card hover:bg-accent/50"
                      }`}
                      onClick={() => form.setValue("selectedPackage", pkg.id)}
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{pkg.name}</div>
                        <div className="font-bold">${pkg.price}</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pkg.description}
                      </p>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};
