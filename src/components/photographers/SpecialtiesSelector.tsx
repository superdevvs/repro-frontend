
import React from 'react';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Define the specialties array in a constants file or use it directly here for simplicity
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

export const photographerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  location: z.string().min(2, { message: 'Location is required' }),
  specialties: z.string().array().min(1, { message: 'Select at least one specialty' }),
  status: z.enum(['available', 'busy', 'offline']),
  avatar: z.string().optional(),
});

export type PhotographerFormValues = z.infer<typeof photographerFormSchema>;

interface SpecialtiesSelectorProps {
  form: UseFormReturn<PhotographerFormValues>;
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
}

export function SpecialtiesSelector({ 
  form, 
  selectedSpecialties, 
  onSpecialtyChange 
}: SpecialtiesSelectorProps) {
  return (
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
                onClick={() => onSpecialtyChange(specialty)}
              >
                {specialty}
              </Button>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
