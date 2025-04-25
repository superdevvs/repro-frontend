
import { UserData } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

// Login function that stores user data in localStorage
export const loginUser = (
  userData: UserData, 
  setUser: (user: UserData) => void,
  setIsAuthenticated: (value: boolean) => void,
  setRole: (role: string) => void,
  setSession: (session: Session | null) => void
) => {
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  // Update state
  setUser(userData);
  setIsAuthenticated(true);
  setRole(userData.role || 'client');
  
  // Set a mock session for development purposes
  const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: {
      id: userData.id,
      app_metadata: {},
      user_metadata: { role: userData.role },
      aud: 'authenticated',
      email: userData.email,
      role: userData.role,
      created_at: userData.createdAt || new Date().toISOString(),
    }
  } as Session;
  
  setSession(mockSession);
  console.log('Login successful via authService');
};

// Logout function that removes user data from localStorage
export const logoutUser = (
  setUser: (user: null) => void,
  setIsAuthenticated: (value: boolean) => void,
  setRole: (role: string) => void,
  setSession: (session: null) => void
) => {
  // Remove user data from localStorage
  localStorage.removeItem('user');
  // Update state
  setUser(null);
  setIsAuthenticated(false);
  setRole('client');
  setSession(null);
  console.log('Logout successful via authService');
};

// Function to update user role
export const updateUserRole = (
  role: string,
  setRole: (role: string) => void,
  user: UserData | null,
  setUser: (user: UserData | null) => void,
  session: Session | null,
  setSession: (session: Session | null) => void
) => {
  if (user) {
    // Make sure we're using a valid Role type by casting it
    const typedRole = role as UserData['role'];
    const updatedUser = { ...user, role: typedRole };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Update session if it exists
    if (session) {
      setSession({
        ...session,
        user: {
          ...session.user,
          role: typedRole,
          user_metadata: {
            ...session.user.user_metadata,
            role: typedRole
          }
        }
      });
    }
    
    console.log('User role updated via authService to:', role);
  }
  setRole(role);
};
