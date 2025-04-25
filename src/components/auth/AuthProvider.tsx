
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserData } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

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
  session: Session | null; // Add session property
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
  session: null, // Initialize with null
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
  const [session, setSession] = useState<Session | null>(null); // Add session state

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        setRole(parsedUser.role || 'client');
        
        // Set a mock session for development purposes
        // In a real app, this would come from Supabase auth.getSession()
        setSession({
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: {
            id: parsedUser.id,
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            email: parsedUser.email,
            role: parsedUser.role,
            created_at: parsedUser.createdAt || new Date().toISOString(),
          }
        } as Session);
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
    
    // Set a mock session for development purposes
    setSession({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      user: {
        id: userData.id,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        email: userData.email,
        role: userData.role,
        created_at: userData.createdAt || new Date().toISOString(),
      }
    } as Session);
    
    console.log('Login successful, user role:', userData.role);
  };

  // Logout function
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setRole('client');
    setSession(null); // Clear session
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
      
      // Update session if it exists
      if (session) {
        setSession({
          ...session,
          user: {
            ...session.user,
            role: newRole
          }
        });
      }
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    role,
    session, // Add session to context
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
