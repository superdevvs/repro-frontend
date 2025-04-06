
import { createContext, useContext } from 'react';
import { UserData } from '@/types/auth';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string;
  login: (userData: UserData) => void;
  logout: () => void;
  setUserRole: (role: string) => void;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: 'client',
  login: () => {},
  logout: () => {},
  setUserRole: () => {},
});

// Hook for using the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
