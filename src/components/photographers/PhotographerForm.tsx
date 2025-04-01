
import React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AvatarUploader } from './AvatarUploader';
import { SpecialtiesSelector, photographerFormSchema, PhotographerFormValues } from './SpecialtiesSelector';

interface PhotographerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: {
    id?: string;
    name: string;
    email: string;
    location: string;
    specialties: string[];
    status: string;
    avatar?: string;
  };
  formType?: 'photographers' | 'editors';
}

export function PhotographerForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  formType = 'photographers'
}: PhotographerFormProps) {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const isEditMode = !!initialData;
  const isEditorForm = formType === 'editors';
  const entityType = isEditorForm ? 'Editor' : 'Photographer';

  const form = useForm<PhotographerFormValues>({
    resolver: zodResolver(photographerFormSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      email: initialData.email,
      location: initialData.location,
      specialties: initialData.specialties,
      status: initialData.status as 'available' | 'busy' | 'offline',
      avatar: initialData.avatar,
    } : {
      name: '',
      email: '',
      location: '',
      specialties: [],
      status: 'available',
      avatar: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      setAvatarUrl(initialData.avatar);
      setSelectedSpecialties(initialData.specialties);
    }
  }, [initialData]);

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((current) => {
      if (current.includes(specialty)) {
        return current.filter((s) => s !== specialty);
      } else {
        return [...current, specialty];
      }
    });
  };

  useEffect(() => {
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
    
    if (avatarUrl) {
      data.avatar = avatarUrl;
      console.log("Final avatar URL in form submission:", avatarUrl);
    }
    
    onSubmit(data);
    
    if (!isEditMode) {
      resetForm();
    } else {
      onOpenChange(false);
    }
  };

  const resetForm = () => {
    if (!isEditMode) {
      form.reset();
      setAvatarUrl('');
      setSelectedSpecialties([]);
    }
    setShowUploadOptions(false);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open && !isEditMode) {
      resetForm();
    }
  }, [open, isEditMode]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? `Edit ${entityType}` : `Add New ${entityType}`}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? `Update ${entityType.toLowerCase()} information in your directory.` 
              : `Add a new ${entityType.toLowerCase()} to your directory.`}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-4">
            <AvatarUploader 
              avatarUrl={avatarUrl}
              onAvatarChange={(url) => {
                setAvatarUrl(url);
                form.setValue('avatar', url);
                form.trigger('avatar');
              }}
              showUploadOptions={showUploadOptions}
              onShowUploadOptions={setShowUploadOptions}
            />
            
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
            
            <SpecialtiesSelector 
              form={form}
              selectedSpecialties={selectedSpecialties}
              onSpecialtyChange={handleSpecialtyChange}
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
              <Button type="submit">{isEditMode ? `Update ${entityType}` : `Add ${entityType}`}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
