
import { createContext, useContext } from 'react';
import { UserData } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string;
  session: Session | null; // Add session property
  login: (userData: UserData) => void;
  logout: () => void;
  setUserRole: (role: string) => void;
  setUser: (updater: ((prevUser: UserData | null) => UserData | null)) => void; // Add setUser property
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: 'client',
  session: null, // Initialize with null
  login: () => {},
  logout: () => {},
  setUserRole: () => {},
  setUser: () => {}, // Add setUser default implementation
});

// Hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
