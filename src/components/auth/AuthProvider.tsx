import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define types
export type Role = 'superadmin' | 'admin' | 'photographer' | 'client' | 'editor';

export interface UserMetadata {
  clientId?: string;
  [key: string]: any; // Allow for other metadata properties
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  company?: string;
  createdAt?: string;
  lastLogin?: string;
  bio?: string;
  username?: string;
  metadata?: UserMetadata;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles: Role[]) => boolean;
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin' as Role,
    avatar: 'https://ui.shadcn.com/avatars/01.png',
    phone: '+1 (555) 123-4567',
    company: 'Real Estate Media Inc.',
    createdAt: '2023-01-15T08:30:00Z',
    lastLogin: '2023-06-12T14:45:00Z',
    bio: 'Admin User bio',
    username: 'adminuser'
  },
  {
    id: '2',
    name: 'Photographer User',
    email: 'photographer@example.com',
    password: 'password',
    role: 'photographer' as Role,
    avatar: 'https://ui.shadcn.com/avatars/02.png',
    phone: '+1 (555) 987-6543',
    createdAt: '2023-02-10T10:15:00Z',
    lastLogin: '2023-06-10T09:20:00Z',
    bio: 'Photographer User bio',
    username: 'photographeruser'
  },
  {
    id: '3',
    name: 'Client User',
    email: 'client@example.com',
    password: 'password',
    role: 'client' as Role,
    avatar: 'https://ui.shadcn.com/avatars/03.png',
    company: 'Premier Properties',
    createdAt: '2023-03-05T11:45:00Z',
    lastLogin: '2023-06-11T16:30:00Z',
    bio: 'Client User bio',
    username: 'clientuser',
    metadata: {
      clientId: '3' // Adding clientId to the metadata for the client user
    }
  },
];

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/signup', '/forgot-password'];

// Role-based route access
const routePermissions: Record<string, Role[]> = {
  '/dashboard': ['superadmin', 'admin', 'photographer', 'client', 'editor'],
  '/shoots': ['superadmin', 'admin', 'photographer', 'client'],
  '/book-shoot': ['superadmin', 'admin', 'client'],
  '/photographers': ['superadmin', 'admin'],
  '/clients': ['superadmin', 'admin'],
  '/media': ['superadmin', 'admin', 'photographer', 'client'],
  '/invoices': ['superadmin', 'admin', 'client'],
  '/accounts': ['superadmin', 'admin'],
  '/availability': ['superadmin', 'admin', 'photographer'],
  '/reports': ['superadmin', 'admin'],
  '/settings': ['superadmin', 'admin', 'photographer', 'client', 'editor'],
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Set authenticated state based on user
  const isAuthenticated = !!user;
  
  // Default role if not authenticated
  const role = user?.role || 'client';

  // Check if user has permission for specific roles
  const hasPermission = (requiredRoles: Role[]): boolean => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  useEffect(() => {
    // Save user to localStorage when it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Login function
  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Update last login time
      const userWithUpdatedLogin = {
        ...foundUser,
        lastLogin: new Date().toISOString(),
      };
      
      // Remove password before setting user
      const { password, ...userWithoutPassword } = userWithUpdatedLogin;
      setUser(userWithoutPassword);
      
      toast.success(`Welcome back, ${userWithoutPassword.name}`);
      return Promise.resolve();
    } else {
      toast.error("Invalid email or password");
      return Promise.reject(new Error('Invalid email or password'));
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
