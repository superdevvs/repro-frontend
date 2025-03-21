
import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CameraIcon, UploadIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const photographerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  location: z.string().min(2, { message: 'Location is required' }),
  specialties: z.string().array().min(1, { message: 'Select at least one specialty' }),
  status: z.enum(['available', 'busy', 'offline']),
  avatar: z.string().optional(),
});

type PhotographerFormValues = z.infer<typeof photographerFormSchema>;

interface PhotographerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PhotographerFormValues) => void;
}

const specialtyOptions = [
  'Residential',
  'Commercial',
  'Aerial',
  'Virtual Tours',
  'Twilight',
  'HDR',
  'Drone',
  '3D Tours',
];

export function PhotographerForm({ open, onOpenChange, onSubmit }: PhotographerFormProps) {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PhotographerFormValues>({
    resolver: zodResolver(photographerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      location: '',
      specialties: [],
      status: 'available',
      avatar: '',
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name, file.type, file.size);
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an image file (JPEG, PNG, etc.)',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload an image smaller than 5MB',
          variant: 'destructive',
        });
        return;
      }
      
      // Create URL for preview
      const url = URL.createObjectURL(file);
      console.log("Created object URL:", url);
      setAvatarUrl(url);
      form.setValue('avatar', url);
      form.trigger('avatar');
      setShowUploadOptions(false);
      
      toast({
        title: 'File uploaded',
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      console.log("No file selected");
    }
  };

  const handleExternalUpload = (source: 'google-drive' | 'dropbox') => {
    // In a real app, this would launch the respective picker
    // For demo purposes, we'll just show a toast and use a placeholder
    let serviceName = source === 'google-drive' ? 'Google Drive' : 'Dropbox';
    
    // Simulate loading state
    toast({
      title: `Connecting to ${serviceName}`,
      description: `Opening ${serviceName} file picker...`,
    });
    
    // Mock successful upload with a placeholder avatar after a short delay
    setTimeout(() => {
      // In a real implementation, you would get the URL from the API response
      const placeholderUrl = source === 'google-drive'
        ? 'https://ui.shadcn.com/avatars/02.png'  // Different image for each source
        : 'https://ui.shadcn.com/avatars/03.png';
      
      console.log("Image URL being set:", placeholderUrl);
      setAvatarUrl(placeholderUrl);
      form.setValue('avatar', placeholderUrl);
      form.trigger('avatar');
      setShowUploadOptions(false);
      
      toast({
        title: 'File uploaded',
        description: `Image from ${serviceName} has been uploaded successfully.`,
      });
    }, 1500);
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((current) => {
      if (current.includes(specialty)) {
        return current.filter((s) => s !== specialty);
      } else {
        return [...current, specialty];
      }
    });
  };

  React.useEffect(() => {
    form.setValue('specialties', selectedSpecialties);
    if (selectedSpecialties.length > 0) {
      form.clearErrors('specialties');
    }
  }, [selectedSpecialties, form]);

  const handleSubmitForm = (data: PhotographerFormValues) => {
    if (selectedSpecialties.length === 0) {
      form.setError('specialties', {
        type: 'manual',
        message: 'Select at least one specialty',
      });
      return;
    }
    
    // Make sure we have the avatar URL in the form data
    if (avatarUrl) {
      data.avatar = avatarUrl;
      console.log("Final avatar URL in form submission:", avatarUrl);
    }
    
    onSubmit(data);
    form.reset();
    setAvatarUrl('');
    setSelectedSpecialties([]);
  };

  const resetForm = () => {
    form.reset();
    setAvatarUrl('');
    setSelectedSpecialties([]);
    setShowUploadOptions(false);
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Photographer</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24 cursor-pointer border-2 border-border" onClick={() => setShowUploadOptions(true)}>
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="Profile" />
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
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter photographer's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialties"
              render={() => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialtyOptions.map((specialty) => (
                      <Button
                        type="button"
                        key={specialty}
                        variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSpecialtyChange(specialty)}
                      >
                        {specialty}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">Add Photographer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
