
/**
 * Client type definition
 */
export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  shootsCount: number;
  lastActivity: string;
  avatar?: string;
}
