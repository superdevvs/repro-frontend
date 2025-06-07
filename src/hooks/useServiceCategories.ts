import { useQuery } from '@tanstack/react-query';

export const useServiceCategories = () => {
  return useQuery({
    queryKey: ['serviceCategories'],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service categories');
      }

      const data = await response.json();
      console.log('Fetched service categories:', data);
      return data;
    }
  });
};
