
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PermissionRule, RolePermissions } from '@/types/permissions';
import { permissionsConfig } from '@/config/permissions';
import { useAuth } from '@/components/auth/AuthProvider';
import { Role } from '@/components/auth';

interface PermissionsContextType {
  can: (resource: string, action: string, conditions?: Record<string, any>) => boolean;
  userPermissions: PermissionRule[];
  isLoading: boolean;
}

const defaultContext: PermissionsContextType = {
  can: () => false,
  userPermissions: [],
  isLoading: true,
};

const PermissionsContext = createContext<PermissionsContextType>(defaultContext);

export const usePermissions = () => useContext(PermissionsContext);

interface PermissionsProviderProps {
  children: React.ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const { role, user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [userPermissions, setUserPermissions] = useState<PermissionRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    // Load permissions based on user role
    const loadPermissions = () => {
      if (!isAuthenticated || !role) {
        setUserPermissions([]);
        setIsLoading(false);
        return;
      }

      // Get permissions from config based on role
      const rolePermissions: RolePermissions = permissionsConfig[role as Role] || { role: 'client', permissions: [] };
      setUserPermissions(rolePermissions.permissions);
      setIsLoading(false);
    };

    loadPermissions();
  }, [role, isAuthenticated, authLoading]);

  const can = (resource: string, action: string, conditions?: Record<string, any>): boolean => {
    if (isLoading || authLoading || !isAuthenticated) return false;

    // Check if user has the required permission
    const hasPermission = userPermissions.some(permission => 
      permission.resource === resource && 
      permission.action === action
    );

    if (!hasPermission) return false;

    // If there are conditions, check those as well
    // This can be extended to handle more complex condition checks
    if (conditions) {
      // Example: check if user can only perform action on their own resources
      if (conditions.selfOnly && user?.id !== conditions.userId) {
        return false;
      }
      
      // Example: check if user can only perform action on assigned resources
      if (conditions.assignedOnly && !conditions.isAssigned) {
        return false;
      }
    }

    return true;
  };

  return (
    <PermissionsContext.Provider value={{ can, userPermissions, isLoading }}>
      {children}
    </PermissionsContext.Provider>
  );
};
