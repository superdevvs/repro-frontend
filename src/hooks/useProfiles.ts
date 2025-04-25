
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/auth';

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      // Map database fields to UserData fields
      return data.map(profile => ({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar,
        phone: profile.phone,
        company: profile.company,
        bio: profile.bio,
        username: profile.username,
        lastLogin: profile.last_login,
        createdAt: profile.created_at,
        isActive: profile.is_active,
        metadata: profile.metadata
      })) as UserData[];
    }
  });
}
