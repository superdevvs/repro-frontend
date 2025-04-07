
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserData } from '@/types/auth';

// Define the Role type as a string literal union
export type Role = 'admin' | 'photographer' | 'client' | 'editor' | 'superadmin';

// Define the User interface
export interface User {
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
}

// We don't need to redefine UserData here since we're importing it from @/types/auth

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: Role;
  login: (userData: UserData) => void;
  logout: () => void;
  setUserRole: (role: Role) => void;
}

// Create a context object
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: 'client',
  login: () => {},
  logout: () => {},
  setUserRole: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<Role>('client');

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setRole(parsedUser.role || 'client');
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (userData: UserData) => {
    // Store the user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.role || 'client');
    console.log('Login successful, user role:', userData.role);
  };

  // Logout function
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setRole('client');
    console.log('User logged out');
  };

  const setUserRole = (newRole: Role) => {
    setRole(newRole);
    
    // Update user object with new role
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('User role updated to:', newRole);
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    role,
    login,
    logout,
    setUserRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
