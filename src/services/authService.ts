
import { UserData } from '@/types/auth';

// Login function that stores user data in localStorage
export const loginUser = (
  userData: UserData, 
  setUser: (user: UserData) => void,
  setIsAuthenticated: (value: boolean) => void,
  setRole: (role: string) => void
) => {
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  // Update state
  setUser(userData);
  setIsAuthenticated(true);
  setRole(userData.role || 'client');
  console.log('Login successful via authService');
};

// Logout function that removes user data from localStorage
export const logoutUser = (
  setUser: (user: null) => void,
  setIsAuthenticated: (value: boolean) => void,
  setRole: (role: string) => void
) => {
  // Remove user data from localStorage
  localStorage.removeItem('user');
  // Update state
  setUser(null);
  setIsAuthenticated(false);
  setRole('client');
  console.log('Logout successful via authService');
};

// Function to update user role
export const updateUserRole = (
  role: string,
  setRole: (role: string) => void,
  user: UserData | null,
  setUser: (user: UserData | null) => void
) => {
  if (user) {
    // Make sure we're using a valid Role type by casting it
    const typedRole = role as UserData['role'];
    const updatedUser = { ...user, role: typedRole };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    console.log('User role updated via authService to:', role);
  }
  setRole(role);
};
