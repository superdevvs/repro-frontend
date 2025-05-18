
import { PermissionsMap, Resource, Action } from '@/types/permissions';

// Define available resources
export const resources: Resource[] = [
  { id: 'dashboard', name: 'Dashboard', description: 'Main dashboard access' },
  { id: 'shoots', name: 'Shoots', description: 'Photo shoots management' },
  { id: 'invoices', name: 'Invoices', description: 'Invoice management' },
  { id: 'clients', name: 'Clients', description: 'Client management' },
  { id: 'photographers', name: 'Photographers', description: 'Photographer management' },
  { id: 'accounts', name: 'Accounts', description: 'User accounts' },
  { id: 'availability', name: 'Availability', description: 'Scheduling availability' },
  { id: 'settings', name: 'Settings', description: 'System settings' },
  { id: 'integrations', name: 'Integrations', description: 'Third-party integrations' },
];

// Define available actions
export const actions: Action[] = [
  { id: 'view', name: 'View', description: 'Can view' },
  { id: 'create', name: 'Create', description: 'Can create' },
  { id: 'update', name: 'Update', description: 'Can update' },
  { id: 'delete', name: 'Delete', description: 'Can delete' },
  { id: 'approve', name: 'Approve', description: 'Can approve' },
  { id: 'assign', name: 'Assign', description: 'Can assign' },
  { id: 'book', name: 'Book', description: 'Can book' },
];

// Define role-based permissions
export const permissionsConfig: PermissionsMap = {
  superadmin: {
    role: 'superadmin',
    permissions: [
      // Superadmins have all permissions
      ...resources.flatMap(resource => 
        actions.map(action => ({
          id: `${resource.id}-${action.id}`,
          resource: resource.id,
          action: action.id,
        }))
      )
    ]
  },
  admin: {
    role: 'admin',
    permissions: [
      // Admins have most permissions
      ...resources.flatMap(resource => 
        actions.map(action => ({
          id: `${resource.id}-${action.id}`,
          resource: resource.id,
          action: action.id,
        }))
      ).filter(p => !(p.resource === 'integrations' && p.action === 'delete'))
    ]
  },
  client: {
    role: 'client',
    permissions: [
      // Dashboard access
      { id: 'dashboard-view', resource: 'dashboard', action: 'view' },
      
      // Shoot permissions
      { id: 'shoots-view', resource: 'shoots', action: 'view' },
      { id: 'shoots-book', resource: 'shoots', action: 'book' },
      
      // Invoice permissions
      { id: 'invoices-view', resource: 'invoices', action: 'view' },
      
      // Profile settings
      { id: 'settings-view', resource: 'settings', action: 'view' },
      { id: 'settings-update', resource: 'settings', action: 'update', conditions: { selfOnly: true } },
    ]
  },
  photographer: {
    role: 'photographer',
    permissions: [
      // Dashboard access
      { id: 'dashboard-view', resource: 'dashboard', action: 'view' },
      
      // Shoot permissions
      { id: 'shoots-view', resource: 'shoots', action: 'view' },
      { id: 'shoots-update', resource: 'shoots', action: 'update', conditions: { assignedOnly: true } },
      
      // Client permissions
      { id: 'clients-view', resource: 'clients', action: 'view' },
      
      // Availability permissions
      { id: 'availability-view', resource: 'availability', action: 'view' },
      { id: 'availability-update', resource: 'availability', action: 'update', conditions: { selfOnly: true } },
      
      // Profile settings
      { id: 'settings-view', resource: 'settings', action: 'view' },
      { id: 'settings-update', resource: 'settings', action: 'update', conditions: { selfOnly: true } },
    ]
  },
  editor: {
    role: 'editor',
    permissions: [
      // Dashboard access
      { id: 'dashboard-view', resource: 'dashboard', action: 'view' },
      
      // Shoot permissions
      { id: 'shoots-view', resource: 'shoots', action: 'view' },
      { id: 'shoots-update', resource: 'shoots', action: 'update', conditions: { assignedOnly: true } },
      
      // Client permissions
      { id: 'clients-view', resource: 'clients', action: 'view' },
      
      // Profile settings
      { id: 'settings-view', resource: 'settings', action: 'view' },
      { id: 'settings-update', resource: 'settings', action: 'update', conditions: { selfOnly: true } },
    ]
  }
};
