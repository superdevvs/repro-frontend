
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type Service = {
  id: string;
  name: string;
  description?: string;
  price: number;
  delivery_time?: number;
  active: boolean;
  category?: string;
  category_id?: string;
  photographer_required?: boolean;
  service_categories?: {
    id: string;
    name: string;
  };
};

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_categories (
            id,
            name
          )
        `)
        .order('category_id')
        .order('display_order');
      
      if (error) throw error;
      
      // Map database fields to component expected fields
      return data?.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        delivery_time: item.duration,
        active: item.is_active || false,
        category: item.category,
        category_id: item.category_id,
        photographer_required: false,
        service_categories: item.service_categories
      }));
    }
  });
};
