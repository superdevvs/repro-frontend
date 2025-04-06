
// Define the role types for the application
export type Role = 'admin' | 'client' | 'photographer' | 'editor' | 'superadmin';

// Define user metadata interface
export interface UserMetadata {
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: boolean;
    emailFrequency?: 'daily' | 'weekly' | 'monthly' | 'never';
  };
  lastActivity?: string;
  features?: string[];
  // Add missing properties that are being referenced in other files
  clientId?: string;
  phone?: string;
  company?: string;
}

// Define the user data interface
export interface UserData {
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
  metadata?: UserMetadata;
}

// Define the auth state interface
export interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: string;
}
