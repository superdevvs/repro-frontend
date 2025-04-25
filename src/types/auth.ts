
import { Role } from '@/components/auth';
import { Session } from '@supabase/supabase-js';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  company?: string;
  bio?: string;
  username?: string;
  lastLogin?: string;
  createdAt?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
  session?: Session;
}
