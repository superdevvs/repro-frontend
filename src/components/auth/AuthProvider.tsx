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

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: Role;
  session: Session | null;
  login: (userData: UserData) => void;
  logout: () => void;
  setUserRole: (role: Role) => void;
  setUser: (userData: UserData) => void;
}

// Create a context object
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: 'client',
  session: null,
  login: () => {},
  logout: () => {},
  setUserRole: () => {},
  setUser: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Helper function to convert string to base64url format (JWT compatible)
const toBase64Url = (str: string): string => {
  // First encode to base64
  const base64 = btoa(str)
    // Then convert to base64url by replacing characters
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return base64;
};

// Generate a properly formatted mock JWT token that will pass validation
const generateMockJWT = (userId: string, role: string): string => {
  // Create a base64url encoded header
  const header = toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  
  // Current timestamp in seconds
  const now = Math.floor(Date.now() / 1000);
  
  // Create a base64url encoded payload with standard JWT claims
  const payload = toBase64Url(JSON.stringify({
    sub: userId,
    role: role,
    iat: now,
    exp: now + 3600,
    iss: 'necyyfxufhmacccbhkdm',
    aud: 'authenticated'
  }));
  
  // Create a valid signature format
  // In a real JWT, this would be cryptographically signed
  // For our mock JWT, we'll create something that looks valid to parsers
  const mockSecret = 'supabase-mock-secret-key-for-testing-purposes-only';
  const mockSignatureData = `${header}.${payload}.${mockSecret}`;
  const signature = toBase64Url(mockSignatureData);
  
  // Combine all parts with dots to form a valid JWT structure
  return `${header}.${payload}.${signature}`;
};



export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [role, setRole] = useState<Role>('client');
  const [session, setSession] = useState<Session | null>(null);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        
        // For development purposes, set admin role if none is defined
        // This will help with testing RLS policies
        setRole(parsedUser.role || 'admin');
        
        // Set a mock session for development purposes with proper role claim
        const mockToken = generateMockJWT(parsedUser.id, parsedUser.role || 'admin');
        
        const mockSession = {
          access_token: mockToken,
          refresh_token: `mock-refresh-token-${Date.now()}`,
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: {
            id: parsedUser.id,
            app_metadata: {},
            user_metadata: { role: parsedUser.role || 'admin' },
            aud: 'authenticated',
            email: parsedUser.email,
            role: parsedUser.role || 'admin',
            created_at: parsedUser.createdAt || new Date().toISOString(),
          }
        } as Session;
        
        setSession(mockSession);
        
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = (userData: UserData) => {
    // Default to admin role if not specified (for development purposes)
    const roleToUse = userData.role || 'admin';
    
    // Update userData with the role
    const updatedUserData = {
      ...userData,
      role: roleToUse
    };
    
    // Store the user data in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    setUser(updatedUserData);
    setIsAuthenticated(true);
    setRole(roleToUse);
    
    // Generate a proper JWT token structure for development
    const mockToken = generateMockJWT(updatedUserData.id, roleToUse);
    
    // Set a mock session for development purposes with proper role claim
    const mockSession = {
      access_token: mockToken,
      refresh_token: `mock-refresh-token-${Date.now()}`,
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      token_type: 'bearer',
      user: {
        id: updatedUserData.id,
        app_metadata: {},
        user_metadata: { role: roleToUse },
        aud: 'authenticated',
        email: updatedUserData.email,
        role: roleToUse,
        created_at: updatedUserData.createdAt || new Date().toISOString(),
      }
    } as Session;
    
    setSession(mockSession);
    
    console.log('Login successful, user role:', roleToUse);
  };

  // Logout function
  const logout = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setRole('client');
    setSession(null);
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
        // Generate new JWT with updated role
        const mockToken = generateMockJWT(user.id, newRole);
        
        setSession({
          ...session,
          access_token: mockToken,
          user: {
            ...session.user,
            role: newRole,
            user_metadata: {
              ...session.user.user_metadata,
              role: newRole
            }
          }
        });
      }
    }
  };

  // Update user data function
  const updateUser = (userData: UserData) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      // Keep the role if not provided in userData
      if (!userData.role) {
        updatedUser.role = user.role;
      }
      
      // Store updated user data in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update role state if it changed
      if (userData.role && userData.role !== role) {
        setRole(userData.role as Role);
      }
      
      // Update session if it exists
      if (session) {
        const mockToken = generateMockJWT(updatedUser.id, updatedUser.role || role);
        
        setSession({
          ...session,
          access_token: mockToken,
          user: {
            ...session.user,
            role: updatedUser.role,
            user_metadata: {
              ...session.user.user_metadata,
              role: updatedUser.role
            }
          }
        });
      }
      
      console.log('User data updated');
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    role,
    session,
    login,
    logout,
    setUserRole,
    setUser: updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};