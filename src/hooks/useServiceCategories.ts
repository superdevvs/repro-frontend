
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      // First, try to fetch existing categories from the database
      const { data: existingCategories, error: fetchError } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order');
      
      // If no categories exist or there's an error, use default categories
      if (fetchError || !existingCategories || existingCategories.length === 0) {
        const defaultCategories = [
          { id: 'photo', name: 'Photos', display_order: 1 },
          { id: 'video', name: 'Video', display_order: 2 },
          { id: '360-3d', name: '360/3D Tours', display_order: 3 },
          { id: 'virtual-staging', name: 'Virtual Staging', display_order: 4 }
        ];

        // Insert default categories if they don't exist
        const { error: insertError } = await supabase
          .from('service_categories')
          .insert(defaultCategories)
          .select();

        if (insertError) {
          console.error('Error inserting default categories:', insertError);
          return defaultCategories;
        }

        return defaultCategories;
      }
      
      return existingCategories;
    }
  });
};
