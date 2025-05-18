
import React from 'react';
import { usePermission } from '@/hooks/usePermission';

interface PermissionGateProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  conditions?: Record<string, any>;
}

/**
 * A component that renders its children only if the user has permission
 * to perform the specified action on the specified resource.
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  resource, 
  action, 
  children, 
  fallback = null,
  conditions
}) => {
  const { can } = usePermission();
  const hasPermission = can(resource, action, conditions);

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

/**
 * A higher-order component that wraps a component to only render it
 * if the user has the specified permission.
 */
export function withPermission(
  resource: string, 
  action: string, 
  conditions?: Record<string, any>
) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function WithPermission(props: P) {
      const { can } = usePermission();
      const hasPermission = can(resource, action, conditions);

      return hasPermission ? <Component {...props} /> : null;
    };
  };
}
