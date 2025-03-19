
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define types
type Role = 'superadmin' | 'admin' | 'photographer' | 'client' | 'editor';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  },
  {
    id: '2',
    name: 'Photographer User',
    email: 'photographer@example.com',
    password: 'password',
    role: 'photographer' as Role,
    avatar: 'https://ui.shadcn.com/avatars/02.png',
  },
  {
    id: '3',
    name: 'Client User',
    email: 'client@example.com',
    password: 'password',
    role: 'client' as Role,
    avatar: 'https://ui.shadcn.com/avatars/03.png',
  },
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  // Initialize user state from localStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Set authenticated state based on user
  const isAuthenticated = !!user;
  
  // Default role if not authenticated
  const role = user?.role || 'client';

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
      // Remove password before setting user
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      navigate('/dashboard');
    } else {
      throw new Error('Invalid email or password');
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, login, logout }}>
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
