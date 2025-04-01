
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  HomeIcon, 
  BuildingIcon, 
  MapPinIcon, 
  UserIcon, 
  MailIcon, 
  PhoneIcon,
  PlusCircleIcon,
  UploadIcon,
  X,
  CameraIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initialClientsData } from '@/data/clientsData';

const formSchema = z.object({
  clientId: z.string().optional(),
  clientName: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  clientEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  clientPhone: z.string().optional(),
  clientCompany: z.string().optional(),
  propertyType: z.enum(["residential", "commercial", "vacant", "rental"]),
  propertyAddress: z.string().min(5, {
    message: "Please enter a valid property address.",
  }),
  propertyCity: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  propertyState: z.string().min(2, {
    message: "Please enter a valid state.",
  }),
  propertyZip: z.string().min(5, {
    message: "Please enter a valid ZIP code.",
  }),
  propertyInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ClientPropertyFormProps {
  onComplete: (data: FormData) => void;
  initialData?: Partial<FormData>;
}

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  avatar?: string;
}

export function ClientPropertyForm({ onComplete, initialData }: ClientPropertyFormProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const { toast } = useToast();
  
  // Add client dialog state
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);
  const [newClientFormData, setNewClientFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    avatar: ''
  });
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: initialData?.clientId || "",
      clientName: initialData?.clientName || "",
      clientEmail: initialData?.clientEmail || "",
      clientPhone: initialData?.clientPhone || "",
      clientCompany: initialData?.clientCompany || "",
      propertyType: initialData?.propertyType || "residential",
      propertyAddress: initialData?.propertyAddress || "",
      propertyCity: initialData?.propertyCity || "",
      propertyState: initialData?.propertyState || "",
      propertyZip: initialData?.propertyZip || "",
      propertyInfo: initialData?.propertyInfo || "",
    },
  });
  
  // Load clients from localStorage or use defaults
  useEffect(() => {
    const storedClients = localStorage.getItem('clientsData');
    const loadedClients = storedClients ? JSON.parse(storedClients) : initialClientsData;
    
    // Map to simplified client structure
    const mappedClients: Client[] = loadedClients.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      company: client.company,
      phone: client.phone,
      avatar: client.avatar
    }));
    
    setClients(mappedClients);
    
    // If initial client ID is provided, select that client
    if (initialData?.clientId) {
      const client = mappedClients.find(c => c.id === initialData.clientId);
      if (client) {
        setSelectedClient(client);
      }
    }
  }, [initialData]);
  
  // Handle form submission
  const onSubmit = (data: FormData) => {
    onComplete(data);
  };
  
  // Select client from dropdown
  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setShowClientDropdown(false);
    
    // Update form values
    form.setValue("clientId", client.id);
    form.setValue("clientName", client.name);
    form.setValue("clientEmail", client.email);
    if (client.phone) form.setValue("clientPhone", client.phone);
    if (client.company) form.setValue("clientCompany", client.company);
  };
  
  // Handle new client file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      const url = URL.createObjectURL(file);
      setNewClientFormData(prev => ({
        ...prev,
        avatar: url
      }));
      setShowUploadOptions(false);
    }
  };
  
  // Handle external service image upload
  const handleExternalUpload = (source: 'google-drive' | 'dropbox') => {
    const placeholderUrl = source === 'google-drive'
      ? 'https://ui.shadcn.com/avatars/02.png'
      : 'https://ui.shadcn.com/avatars/03.png';
    
    setNewClientFormData(prev => ({
      ...prev,
      avatar: placeholderUrl
    }));
    setShowUploadOptions(false);
  };
  
  // Handle client form input changes
  const handleClientFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClientFormData({
      ...newClientFormData,
      [name]: value,
    });
  };
  
  // Handle adding a new client
  const handleAddNewClient = () => {
    // Validate form
    if (!newClientFormData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for the client.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newClientFormData.email.trim() || !newClientFormData.email.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please provide a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new client
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: newClientFormData.name,
      email: newClientFormData.email,
      phone: newClientFormData.phone,
      company: newClientFormData.company,
      avatar: newClientFormData.avatar
    };
    
    // Get existing clients from localStorage
    const storedClients = localStorage.getItem('clientsData');
    const existingClients = storedClients ? JSON.parse(storedClients) : initialClientsData;
    
    // Add new client to the stored client list
    const updatedClients = [
      {
        ...newClient,
        address: '',
        status: 'active',
        shootsCount: 0,
        lastActivity: new Date().toISOString().split('T')[0],
      },
      ...existingClients
    ];
    
    // Update localStorage
    localStorage.setItem('clientsData', JSON.stringify(updatedClients));
    
    // Update local state
    setClients(prev => [newClient, ...prev]);
    
    // Select the new client
    handleSelectClient(newClient);
    
    // Close dialog
    setAddClientDialogOpen(false);
    
    // Reset form
    setNewClientFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      avatar: ''
    });
    
    toast({
      title: "Client Added",
      description: `${newClient.name} has been added successfully.`,
    });
  };
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(clientSearchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-primary" />
                    Client Information
                  </h3>
                  
                  <div className="relative">
                    <FormItem className="flex flex-col">
                      <FormLabel>Select Client</FormLabel>
                      <div className="relative">
                        <div className="flex gap-2">
                          <div 
                            className={cn(
                              "flex-1 flex items-center gap-3 p-2 border rounded-md cursor-pointer hover:bg-secondary/10",
                              selectedClient ? "border-input" : "border-destructive"
                            )}
                            onClick={() => setShowClientDropdown(!showClientDropdown)}
                          >
                            {selectedClient ? (
                              <>
                                <div className="flex-shrink-0">
                                  {selectedClient.avatar ? (
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={selectedClient.avatar} alt={selectedClient.name} />
                                      <AvatarFallback>{selectedClient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                      {selectedClient.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{selectedClient.name}</p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {selectedClient.company || selectedClient.email}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="flex-1 text-muted-foreground">
                                Select a client...
                              </div>
                            )}
                          </div>
                          
                          <Button 
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setAddClientDialogOpen(true)}
                            title="Add New Client"
                          >
                            <PlusCircleIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <FormMessage />
                        
                        {showClientDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-md">
                            <div className="p-2">
                              <Input
                                placeholder="Search clients..."
                                value={clientSearchTerm}
                                onChange={(e) => setClientSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {filteredClients.length > 0 ? (
                                filteredClients.map(client => (
                                  <div
                                    key={client.id}
                                    className="flex items-center gap-3 p-3 hover:bg-secondary/10 cursor-pointer"
                                    onClick={() => handleSelectClient(client)}
                                  >
                                    {client.avatar ? (
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={client.avatar} alt={client.name} />
                                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        {client.name.charAt(0)}
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-medium">{client.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {client.company || client.email}
                                      </p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-3 text-center text-muted-foreground">
                                  No clients found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormItem>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="clientCompany"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <HomeIcon className="h-5 w-5 text-primary" />
                    Property Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Property Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="residential" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Residential
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="commercial" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Commercial
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="vacant" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Vacant Land
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="rental" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Rental
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="propertyAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter property address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="propertyCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
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
                            <Input placeholder="Enter state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="propertyZip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter ZIP code" {...field} />
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
                        <FormLabel>Additional Information (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional property details, access instructions, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" size="lg">
              Continue to Services
            </Button>
          </div>
        </form>
      </Form>
      
      {/* Add New Client Dialog */}
      <Dialog open={addClientDialogOpen} onOpenChange={setAddClientDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer border-2 border-border" onClick={() => setShowUploadOptions(true)}>
                  {newClientFormData.avatar ? (
                    <AvatarImage src={newClientFormData.avatar} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-secondary">
                      <CameraIcon className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 h-8 w-8 p-0 rounded-full"
                  onClick={() => setShowUploadOptions(true)}
                >
                  <UploadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showUploadOptions && (
              <div className="bg-card border rounded-md p-3 relative">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                  onClick={() => setShowUploadOptions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload from device
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                    />
                  </div>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExternalUpload('google-drive')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" 
                      alt="Google Drive" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Google Drive
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleExternalUpload('dropbox')}
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/2202px-Dropbox_Icon.svg.png" 
                      alt="Dropbox" 
                      className="mr-2 h-4 w-4" 
                    />
                    Upload from Dropbox
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={newClientFormData.name}
                  onChange={handleClientFormChange}
                  placeholder="Enter client name"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newClientFormData.email}
                  onChange={handleClientFormChange}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={newClientFormData.phone}
                  onChange={handleClientFormChange}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={newClientFormData.company}
                  onChange={handleClientFormChange}
                  placeholder="Enter company name"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddClientDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNewClient}>
              Add Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
