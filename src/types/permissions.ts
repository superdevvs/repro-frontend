
export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
}

export interface PermissionRule {
  id: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface RolePermissions {
  role: string;
  permissions: PermissionRule[];
}

export type PermissionsMap = Record<string, RolePermissions>;
