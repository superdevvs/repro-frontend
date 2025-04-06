
import { ReactNode } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { loginUser, logoutUser, updateUserRole } from '@/services/authService';
import { UserData, UserMetadata } from '@/types/auth';

// Export the User type for use in other components
export type User = UserData;
export type Role = 'admin' | 'client' | 'photographer' | 'editor' | 'superadmin';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user, 
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    role,
    setRole
  } = useAuthState();

  // Login handler
  const login = (userData: UserData) => {
    loginUser(userData, setUser, setIsAuthenticated, setRole);
  };

  // Logout handler
  const logout = () => {
    logoutUser(setUser, setIsAuthenticated, setRole);
  };

  // Set user role handler
  const setUserRole = (newRole: string) => {
    updateUserRole(newRole, setRole, user, setUser);
  };

  // Value object to be provided to consumers
  const value = {
    user,
    isAuthenticated,
    isLoading,
    role,
    login,
    logout,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export the useAuth hook directly from the component file for convenience
export { useAuth } from '@/context/AuthContext';
