
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data;
    }
  });
};
